import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { getBaseUrl } from '@/lib/baseUrl';


export async function POST(
    request: NextRequest,
    { params }: { params: { teamId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, role = 'member' } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if team exists and user is owner/admin
        const team = await prisma.team.findUnique({
            where: { id: params.teamId },
            include: {
                members: {
                    where: { userId }
                }
            }
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        // Check permission
        const currentUserMember = team.members[0];
        if (!currentUserMember || (team.ownerId !== userId && !['owner', 'admin'].includes(currentUserMember.role))) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Check Team Member Limit (Based on Owner's Plan)
        const { getUserPlan } = await import('@/lib/subscription');
        const ownerPlan = await getUserPlan(team.ownerId);

        // Count current members (including invited)
        // We can optimize this by including count in the initial query or separate count
        const currentMemberCount = await prisma.teamMember.count({
            where: { teamId: params.teamId }
        });

        // Check limit (if not unlimited)
        // Assuming infinite if not specified, but our Types say number. High number for Pro?
        // Professional is 10. Enterprise is unlimited?
        // Let's rely on the number. If plan.features.teamMembers is the cap.
        if (currentMemberCount >= ownerPlan.features.teamMembers) {
            return NextResponse.json({
                error: `Team member limit reached (${ownerPlan.features.teamMembers}). Please upgrade the team owner's plan.`
            }, { status: 403 });
        }

        // Check if user already in team
        // We check by email if the user exists in DB
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Check if already a member
            const isMember = await prisma.teamMember.findUnique({
                where: {
                    userId_teamId: {
                        userId: existingUser.id,
                        teamId: params.teamId
                    }
                }
            });

            if (isMember) {
                return NextResponse.json({ error: 'User is already a member of this team' }, { status: 409 });
            }

            // Add member directly
            await prisma.teamMember.create({
                data: {
                    userId: existingUser.id,
                    teamId: params.teamId,
                    role,
                    status: 'active', // or invited, but if they exist we can auto-add or set to invited
                    invitedBy: userId,
                    invitedAt: new Date(),
                }
            });
        } else {
            // User does not exist, invite by email
            // Check if already invited
            const isInvited = await prisma.teamMember.findFirst({
                where: {
                    teamId: params.teamId,
                    invitedEmail: email
                }
            });

            if (isInvited) {
                return NextResponse.json({ error: 'User already invited' }, { status: 409 });
            }

            // Create member with invitedEmail
            // @ts-ignore - ignoring type check for optional userId until client regeneration
            await prisma.teamMember.create({
                data: {
                    teamId: params.teamId,
                    invitedEmail: email,
                    role,
                    status: 'invited',
                    invitedBy: userId,
                    invitedAt: new Date(),
                    // userId is undefined/null
                }
            });
        }

        // Send Email
        // Log the "Link" for joining (simulation)
        const baseUrl = getBaseUrl();
        const joinLink = `${baseUrl}/sign-up?email=${encodeURIComponent(email)}`;

        await sendEmail({
            to: email,
            subject: `You've been invited to join ${team.name} on LinkShortener`,
            html: `
        <div>
          <h1>Invitation to join ${team.name}</h1>
          <p>You have been invited to collaborate on ${team.name}.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${joinLink}">${joinLink}</a>
        </div>
      `
        });

        // If SMTP is not configured or email failed (common in dev), return the link to the frontend
        if (!process.env.SMTP_HOST) {
            return NextResponse.json({
                success: true,
                message: 'Invitation created. Since SMTP is not configured, please share this link manually:',
                inviteLink: joinLink
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error inviting member:', error);
        return NextResponse.json(
            { error: 'Failed to invite member' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { dummyTeamMembers } from '@/lib/dummy-data';

// In-memory store
let membersStore = [...dummyTeamMembers];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already exists
    if (membersStore.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already a team member' },
        { status: 400 }
      );
    }

    const newMember = {
      id: `member-${Date.now()}`,
      email,
      role,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    membersStore.push(newMember);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to invite member' },
      { status: 500 }
    );
  }
}


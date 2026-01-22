import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractDomain } from '@/lib/email-validation';

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;

      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handle user.created event
 * Creates a new user in the database when they sign up via Clerk
 */
async function handleUserCreated(data: any) {
  const userId = data.id;
  const email = data.email_addresses?.[0]?.email_address;
  const emailVerified = data.email_addresses?.[0]?.verification?.status === 'verified';
  const firstName = data.first_name || '';
  const lastName = data.last_name || '';
  const name = [firstName, lastName].filter(Boolean).join(' ') || null;

  if (!userId || !email) {
    console.error('Missing userId or email in user.created event');
    return;
  }

  const domain = extractDomain(email);

  console.log('Creating user:', {
    id: userId,
    email,
    emailVerified,
    domain,
  });

  await prisma.user.create({
    data: {
      id: userId,
      email,
      name,
      emailVerified,
      emailVerifiedAt: emailVerified ? new Date() : null,
      emailDomain: domain,
    },
  });

  console.log(`✓ User created: ${userId} (${email})`);
}

/**
 * Handle user.updated event
 * Updates user verification status when they verify their email
 */
async function handleUserUpdated(data: any) {
  const userId = data.id;
  const email = data.email_addresses?.[0]?.email_address;
  const emailVerified = data.email_addresses?.[0]?.verification?.status === 'verified';
  const firstName = data.first_name || '';
  const lastName = data.last_name || '';
  const name = [firstName, lastName].filter(Boolean).join(' ') || null;

  if (!userId) {
    console.error('Missing userId in user.updated event');
    return;
  }

  const domain = email ? extractDomain(email) : undefined;

  console.log('Updating user:', {
    id: userId,
    email,
    emailVerified,
    domain,
  });

  // Upsert user (in case webhook was missed or user was created before webhook was set up)
  const updateData: any = {
    emailVerified,
    ...(name && { name }),
    ...(email && { email }),
    ...(domain && { emailDomain: domain }),
  };

  // Set emailVerifiedAt only if newly verified
  if (emailVerified) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    // If user wasn't verified before, set verification timestamp
    if (existingUser && !existingUser.emailVerified) {
      updateData.emailVerifiedAt = new Date();
    }
  }

  await prisma.user.upsert({
    where: { id: userId },
    update: updateData,
    create: {
      id: userId,
      email: email || `user_${userId}@placeholder.com`,
      name,
      emailVerified,
      emailVerifiedAt: emailVerified ? new Date() : null,
      emailDomain: domain,
    },
  });

  console.log(`✓ User updated: ${userId} (verified: ${emailVerified})`);
}

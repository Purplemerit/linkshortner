import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { dummyLinks } from '@/lib/dummy-data';

// Reserved codes that cannot be used
const reservedCodes = ['api', 'dashboard', 'login', 'register', 'admin', 'settings'];

function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (forwardedHost) {
    const proto = forwardedProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : 'https');
    return `${proto}://${forwardedHost.replace(/\/$/, '')}`;
  }
  return request.nextUrl?.origin || '';
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const links = await prisma.link.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      // Format for frontend — build origin using forwarded headers when available
      const origin = getRequestOrigin(request);
      const formattedLinks = links.map((link: any) => ({
        ...link,
        shortUrl: `${origin}/${link.shortCode}`,
      }));

      return NextResponse.json(formattedLinks);
    } catch (dbErr) {
      console.error('DB error while fetching links — falling back to dummy data:', dbErr);
      const origin = getRequestOrigin(request);
      const formattedLinks = dummyLinks.map((link) => ({
        ...link,
        shortUrl: `${origin}/${link.shortCode}`,
      }));
      return NextResponse.json(formattedLinks);
    }
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/links called');
    const { userId } = await auth();
    console.log('userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in our DB (sync with Clerk)
    // In a real app, use webhooks. For now, we'll upsert on action.
    const session = await auth();
    const userEmail = (session as any).sessionClaims?.email as string || `user_${userId}@example.com`;
    console.log('userEmail:', userEmail);

    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: userEmail,
        },
      });
      console.log('User upserted successfully');
    } catch (upsertError) {
      console.error('Error upserting user:', upsertError);
      throw upsertError;
    }

    const body = await request.json();
    const { destination, customCode, tags } = body;

    // Validate URL
    if (!destination || (!destination.startsWith('http://') && !destination.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'Invalid URL (must start with http:// or https://)' },
        { status: 400 }
      );
    }

    let shortCode = customCode;

    if (customCode) {
      // Validate custom code
      if (customCode.length < 3 || customCode.length > 50) {
        return NextResponse.json(
          { error: 'Custom code must be between 3 and 50 characters' },
          { status: 400 }
        );
      }
      if (!/^[a-z0-9-]+$/.test(customCode)) {
        return NextResponse.json(
          { error: 'Custom code can only contain lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }
      if (reservedCodes.includes(customCode.toLowerCase())) {
        return NextResponse.json(
          { error: 'This code is reserved' },
          { status: 400 }
        );
      }

      // Check if taken
      const existing = await prisma.link.findUnique({
        where: { shortCode: customCode }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'This code is already taken' },
          { status: 400 }
        );
      }
    } else {
      // Generate random code
      // Simple 6-char alphanumeric
      shortCode = Math.random().toString(36).substring(2, 8);

      // Ensure uniqueness (retry loop)
      let isUnique = false;
      let retries = 0;
      while (!isUnique && retries < 5) {
        const existing = await prisma.link.findUnique({ where: { shortCode } });
        if (!existing) {
          isUnique = true;
        } else {
          shortCode = Math.random().toString(36).substring(2, 8);
          retries++;
        }
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: 'Failed to generate unique code. Please try again.' },
          { status: 500 }
        );
      }
    }

    const newLink = await prisma.link.create({
      data: {
        shortCode,
        destination,
        userId,
        tags: tags || [],
      },
    });

    const origin = getRequestOrigin(request);
    return NextResponse.json({
      ...newLink,
      shortUrl: `${origin}/${newLink.shortCode}`,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating link:', error);
    const msg = error && (error as any).message ? (error as any).message : String(error);
    if (msg.includes("Can't reach database server") || msg.includes('PrismaClientInitializationError')) {
      console.error('DATABASE UNAVAILABLE - Check connection pooling configuration');
      return NextResponse.json({
        error: 'Database unavailable - please check Supabase connection pooler settings'
      }, { status: 503 });
    }
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

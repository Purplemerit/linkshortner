import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { resolveCname } from 'dns/promises';

export const runtime = 'nodejs'; // Required for DNS module

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }
    // Check Subscription Limits
    const { getUserPlan } = await import('@/lib/subscription');
    const plan = await getUserPlan(userId);

    // Check if plan allows custom domains
    if (plan.customDomains === 0) {
      return NextResponse.json(
        { error: 'Custom domains are available on Starter and Professional plans. Please upgrade.' },
        { status: 403 }
      );
    }

    // Check if limit reached
    const currentCount = await prisma.domain.count({
      where: { userId }
    });

    if (currentCount >= plan.customDomains) {
      return NextResponse.json(
        { error: `You have reached your limit of ${plan.customDomains} custom domains. Please upgrade.` },
        { status: 403 }
      );
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    let verified = false;

    // Real DNS verification
    try {
      const cnameRecords = await resolveCname(domain);
      // Check if CNAME points to our platform
      verified = cnameRecords.some(record =>
        record.includes('short.link') || record.includes('platform')
      );
    } catch (dnsError) {
      // DNS lookup failed - domain not configured yet
      verified = false;
    }

    if (verified) {
      // Save verified domain to database
      await prisma.domain.create({
        data: {
          domain,
          userId,
          verified: true,
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        verified: true,
        verifiedAt: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Domain verification failed. Please ensure CNAME record points to platform.short.link' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Domain verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify domain' },
      { status: 500 }
    );
  }
}


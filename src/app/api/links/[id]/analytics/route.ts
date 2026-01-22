
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15 params
) {
  try {
    const { id } = await params;

    // Auth check - ensure user owns the link
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const link = await prisma.link.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (link.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    let dateWhere: any = {};
    const now = new Date();

    if (startParam && endParam) {
      dateWhere = {
        gte: new Date(startParam),
        lte: new Date(endParam)
      };
    } else {
      // Fallback to range logic
      const startDate = new Date();
      if (range === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (range === '30d') {
        startDate.setDate(now.getDate() - 30);
      } else {
        // Default 7d
        startDate.setDate(now.getDate() - 7);
      }
      dateWhere = { gte: startDate };
    }

    // Filter for the query
    const where = {
      linkId: id,
      timestamp: dateWhere,
    };

    // 1. Total Clicks
    const totalClicks = await prisma.analytics.count({ where });

    // 2. Unique Clicks (by IP hash)
    // Prisma distinct count is a bit tricky, doing two queries
    const uniqueClicksGroup = await prisma.analytics.groupBy({
      by: ['ipHash'],
      where,
    });
    const uniqueClicks = uniqueClicksGroup.length;

    // 3. Top Countries
    const countriesGroup = await prisma.analytics.groupBy({
      by: ['country'],
      where,
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 5,
    });

    const topCountries = countriesGroup.map((g) => ({
      country: g.country || 'Unknown',
      clicks: g._count.country,
      percentage: totalClicks > 0 ? Math.round((g._count.country / totalClicks) * 100) : 0,
    }));

    // 4. Top Referrers
    const referrersGroup = await prisma.analytics.groupBy({
      by: ['referrer'],
      where,
      _count: {
        referrer: true,
      },
      orderBy: {
        _count: {
          referrer: 'desc',
        },
      },
      take: 5,
    });

    const topReferrers = referrersGroup.map((g) => ({
      referrer: g.referrer || 'Direct',
      clicks: g._count.referrer,
      percentage: totalClicks > 0 ? Math.round((g._count.referrer / totalClicks) * 100) : 0,
    }));

    // 5. Device Breakdown
    const devicesGroup = await prisma.analytics.groupBy({
      by: ['device'],
      where,
      _count: {
        device: true,
      },
    });

    const deviceBreakdown = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };

    devicesGroup.forEach((g) => {
      const d = (g.device || 'desktop').toLowerCase();
      const count = g._count.device;

      // Check if it's a known category from our new parser logic
      if (d === 'mobile' || d === 'tablet' || d === 'desktop' || d === 'console' || d === 'smarttv' || d === 'wearable' || d === 'embedded') {
        if (d === 'mobile') deviceBreakdown.mobile += count;
        else if (d === 'tablet') deviceBreakdown.tablet += count;
        else deviceBreakdown.desktop += count; // Treat others as desktop/misc for now
      } else {
        // Legacy: Parse User Agent string
        if (d.includes('mobile') || d.includes('android') || d.includes('iphone')) {
          deviceBreakdown.mobile += count;
        } else if (d.includes('ipad') || d.includes('tablet')) {
          deviceBreakdown.tablet += count;
        } else {
          deviceBreakdown.desktop += count;
        }
      }
    });

    // 6. Clicks by Day (for charts)
    // We'll fetch timestamps and aggregate in memory for simplicity or use raw query.
    // Since we only need counts per day for the last 7/30 days.
    const clicksByDate = await prisma.analytics.groupBy({
      by: ['timestamp'],
      where,
    });

    // But groupBy timestamp is too granular. 
    // Let's just fetch all timestamps for the range (might be heavy if millions of clicks, but okay for MVP)
    // Better: Helper function to generate stats.
    const dailyData = await prisma.analytics.findMany({
      where,
      select: { timestamp: true }
    });

    // Initialize array of 0s for the range
    const days = range === '30d' ? 30 : (range === 'today' ? 24 : 7); // today = hours? let's stick to days logic for now
    const clicksByDay = new Array(days).fill(0);

    dailyData.forEach(d => {
      const date = new Date(d.timestamp);
      if (range === 'today') {
        // Bucket by hour
        const hour = date.getHours();
        // simplistic
      } else {
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < days) {
          // Index from end (today is last)
          clicksByDay[days - 1 - diffDays]++;
        }
      }
    });

    // Top Browsers
    const browsersGroup = await prisma.analytics.groupBy({
      by: ['browser'],
      where,
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } },
      take: 5
    });

    const topBrowsers = browsersGroup.map(g => ({
      browser: g.browser || 'Unknown',
      clicks: g._count.browser
    }));

    // Top OS
    const osGroup = await prisma.analytics.groupBy({
      by: ['os'],
      where,
      _count: { os: true },
      orderBy: { _count: { os: 'desc' } },
      take: 5
    });

    const topOS = osGroup.map(g => ({
      os: g.os || 'Unknown',
      clicks: g._count.os
    }));

    return NextResponse.json({
      linkId: id,
      period: range,
      totalClicks,
      uniqueClicks,
      topCountries,
      topReferrers,
      deviceBreakdown,
      clicksByDay,
      topBrowsers,
      topOS
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

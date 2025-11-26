import { NextRequest, NextResponse } from 'next/server';
import { dummyAnalytics } from '@/lib/dummy-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';

    // In production, fetch analytics for the specific link ID
    // For now, return dummy data
    return NextResponse.json({
      linkId: id,
      period: range,
      ...dummyAnalytics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}


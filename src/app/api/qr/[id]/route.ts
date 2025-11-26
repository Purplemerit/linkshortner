import { NextRequest, NextResponse } from 'next/server';
import { dummyLinks } from '@/lib/dummy-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const size = parseInt(searchParams.get('size') || '300');
    const format = searchParams.get('format') || 'png';

    // Find link
    const link = dummyLinks.find((l) => l.id === id || l.shortCode === id);
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // In production, this would generate the QR code server-side
    // For now, return the URL to generate client-side
    return NextResponse.json({
      qrUrl: link.shortUrl,
      size,
      format,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}


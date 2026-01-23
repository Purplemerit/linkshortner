import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getBaseUrl } from '@/lib/baseUrl';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const size = parseInt(searchParams.get('size') || '300');
    const format = searchParams.get('format') || 'png';

    // Find link by ID or shortCode
    const link = await prisma.link.findFirst({
      where: {
        OR: [
          { id: id },
          { shortCode: id }
        ]
      }
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Dynamic origin
    const origin = getBaseUrl();
    const shortUrl = `${origin}/${link.shortCode}`;

    // In production, this would generate the QR code server-side
    // For now, return the URL to generate client-side
    return NextResponse.json({
      qrUrl: shortUrl,
      size,
      format,
    });
  } catch (error) {
    console.error('QR Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}


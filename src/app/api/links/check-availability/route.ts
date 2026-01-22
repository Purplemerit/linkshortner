import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { reservedCodes } from '@/lib/dummy-data';

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
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter is required' },
        { status: 400 }
      );
    }

    // Check if reserved
    if (reservedCodes.includes(code.toLowerCase())) {
      return NextResponse.json({
        code,
        available: false,
        suggestion: `${code}-${new Date().getFullYear()}`,
      });
    }

    // Check if exists in DB
    const existing = await prisma.link.findUnique({
      where: { shortCode: code }
    });

    if (existing) {
      // Generate suggestion
      const suggestion = `${code}-${new Date().getFullYear()}`;
      return NextResponse.json({
        code,
        available: false,
        suggestion,
      });
    }

    const origin = getRequestOrigin(request);
    return NextResponse.json({
      code,
      available: true,
      shortUrl: `${origin}/${code}`,
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}


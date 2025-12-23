import { NextRequest, NextResponse } from 'next/server';
import { dummyLinks, reservedCodes } from '@/lib/dummy-data';

function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (forwardedHost) {
    const proto = forwardedProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : 'https');
    return `${proto}://${forwardedHost.replace(/\/$/, '')}`;
  }
  return request.nextUrl?.origin || '';
}

// In-memory store
let linksStore = [...dummyLinks];

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

    // Check if exists
    const exists = linksStore.some((link) => link.shortCode.toLowerCase() === code.toLowerCase());

    if (exists) {
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
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}


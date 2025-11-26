import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
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

    // In production, this would check DNS records
    // For now, simulate verification (80% success rate for demo)
    const verified = Math.random() > 0.2;

    if (verified) {
      const sslCertExpiry = new Date();
      sslCertExpiry.setFullYear(sslCertExpiry.getFullYear() + 1);

      return NextResponse.json({
        verified: true,
        verifiedAt: new Date().toISOString(),
        sslCertExpiry: sslCertExpiry.toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Domain verification failed. Please check your DNS settings.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify domain' },
      { status: 500 }
    );
  }
}


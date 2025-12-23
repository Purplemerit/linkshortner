import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 15) || 'NOT_SET',
      CLERK_KEY_EXISTS: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_EXISTS: !!process.env.CLERK_SECRET_KEY,
      VERCEL: process.env.VERCEL || 'not-vercel',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not-set',
    };

    console.log('Environment check:', envCheck);

    return NextResponse.json({
      status: 'Environment check',
      ...envCheck,
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json(
      {
        error: 'Debug check failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

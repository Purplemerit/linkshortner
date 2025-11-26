import { NextRequest, NextResponse } from 'next/server';
import { dummyLinks, reservedCodes } from '@/lib/dummy-data';

// In-memory store (replace with database in production)
let linksStore = [...dummyLinks];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(linksStore);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, customCode, tags } = body;

    // Validate URL
    if (!destination || (!destination.startsWith('http://') && !destination.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'Invalid URL (must start with http:// or https://)' },
        { status: 400 }
      );
    }

    // Generate short code
    let shortCode: string;
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
      // Check if already exists
      if (linksStore.some((link) => link.shortCode === customCode)) {
        return NextResponse.json(
          { error: 'This code is already taken' },
          { status: 400 }
        );
      }
      shortCode = customCode;
    } else {
      // Generate random code
      shortCode = Math.random().toString(36).substring(2, 8);
      // Ensure uniqueness
      while (linksStore.some((link) => link.shortCode === shortCode)) {
        shortCode = Math.random().toString(36).substring(2, 8);
      }
    }

    const newLink = {
      id: `link-${Date.now()}`,
      shortCode,
      shortUrl: `https://short.link/${shortCode}`,
      destination,
      createdAt: new Date().toISOString(),
      clicks: 0,
      uniqueClicks: 0,
      tags: tags || [],
      protected: false,
      expiresAt: null,
      maxClicks: null,
      active: true,
    };

    linksStore.push(newLink);

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}


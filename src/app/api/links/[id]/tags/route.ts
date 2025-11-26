import { NextRequest, NextResponse } from 'next/server';
import { dummyLinks } from '@/lib/dummy-data';

// In-memory store
let linksStore = [...dummyLinks];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { tags } = body;

    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }

    // Find and update link
    const linkIndex = linksStore.findIndex((link) => link.id === id);
    if (linkIndex === -1) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    linksStore[linkIndex].tags = tags;

    return NextResponse.json({
      id,
      tags: linksStore[linkIndex].tags,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tags' },
      { status: 500 }
    );
  }
}


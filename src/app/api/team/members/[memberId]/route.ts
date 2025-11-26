import { NextRequest, NextResponse } from 'next/server';
import { dummyTeamMembers } from '@/lib/dummy-data';

// In-memory store
let membersStore = [...dummyTeamMembers];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;

    const memberIndex = membersStore.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Don't allow removing owner
    if (membersStore[memberIndex].role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove owner' },
        { status: 400 }
      );
    }

    membersStore.splice(memberIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}


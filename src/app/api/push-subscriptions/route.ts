import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint, keys, userAgent } = await request.json();

    // Check if subscription already exists
    let subscription = await PushSubscription.findOne({ endpoint });

    if (subscription) {
      // Update existing subscription
      subscription = await PushSubscription.findOneAndUpdate(
        { endpoint },
        { 
          userId: session.user.id,
          keys,
          userAgent,
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      // Create new subscription
      subscription = await PushSubscription.create({
        userId: session.user.id,
        endpoint,
        keys,
        userAgent
      });
    }

    return NextResponse.json({ success: true, data: subscription }, { status: 201 });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await request.json();

    await PushSubscription.findOneAndDelete({ 
      endpoint, 
      userId: session.user.id 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting push subscription:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
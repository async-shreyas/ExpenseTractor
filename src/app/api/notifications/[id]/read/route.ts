import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Notification from '@/models/Notification';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
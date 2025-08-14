import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Expense from '@/models/Expense';

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    const body = await request.json();
    const expense = await Expense.findOneAndUpdate(
      { _id: params.id, userId: session.user.id, deletedAt: null },
      body,
      { new: true }
    );

    if (!expense) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: params.id, userId: session.user.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!expense) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
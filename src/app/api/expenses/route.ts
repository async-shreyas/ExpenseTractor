import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Expense from '@/models/Expense';
import { z } from 'zod';

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().datetime(),
  notes: z.string().optional(),
  receiptUrl: z.string().url().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: any = { userId: session.user.id, deletedAt: null };
    
    if (period !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      query.date = { $gte: startDate };
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = expenseSchema.parse(body);

    const expense = await Expense.create({
      ...validatedData,
      userId: session.user.id,
      date: new Date(validatedData.date)
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Error creating expense:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
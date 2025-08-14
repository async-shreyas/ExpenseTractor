import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import EMI from '@/models/EMI';
import { z } from 'zod';

const emiSchema = z.object({
  institution: z.string().min(1),
  principal: z.number().positive(),
  interestRate: z.number().min(0),
  emiAmount: z.number().positive(),
  dueDayOfMonth: z.number().min(1).max(31),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.user.id };
    if (active !== undefined) {
      query.active = active;
    }

    const emis = await EMI.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: emis });
  } catch (error) {
    console.error('Error fetching EMIs:', error);
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
    const validatedData = emiSchema.parse(body);

    // Validate EMI amount calculation (simplified)
    const months = Math.ceil((new Date(validatedData.endDate).getTime() - new Date(validatedData.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
    const expectedEMI = (validatedData.principal * (1 + validatedData.interestRate / 100)) / months;
    
    if (Math.abs(validatedData.emiAmount - expectedEMI) > expectedEMI * 0.1) {
      return NextResponse.json({ 
        success: false, 
        error: 'EMI amount seems incorrect. Expected amount: ' + expectedEMI.toFixed(2) 
      }, { status: 400 });
    }

    const emi = await EMI.create({
      ...validatedData,
      userId: session.user.id,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate)
    });

    return NextResponse.json({ success: true, data: emi }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    console.error('Error creating EMI:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
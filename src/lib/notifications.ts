import { Resend } from 'resend';
import User from '@/models/User';
import EmailLog from '@/models/EmailLog';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendEmailNotification(userId: string, title: string, message: string) {
  try {
    const user = await User.findById(userId);
    if (!user?.email) return;

    const { data, error } = await resend.emails.send({
      from: 'ExpenseTracker <noreply@expensetracker.com>',
      to: [user.email],
      subject: title,
      html: `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>Best regards,<br>ExpenseTracker Team</p>
      `,
    });

    if (error) throw error;

    // Log email
    await EmailLog.create({
      userId,
      to: user.email,
      subject: title,
      status: 'sent',
      provider: 'resend'
    });

    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Log failed email
    await EmailLog.create({
      userId,
      to: 'unknown',
      subject: title,
      status: 'failed',
      provider: 'resend',
      error: error.message
    });
    
    throw error;
  }
}
// lib/notifications.ts
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmailNotification(
  userId: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    // Skip if Resend is not configured
    if (!resend) {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
      return false;
    }

    // You'll need to fetch user email from your database
    // This is just a placeholder - implement according to your user model
    const userEmail = await getUserEmail(userId);
    if (!userEmail) {
      console.warn(`No email found for user ${userId}`);
      return false;
    }

    const result = await resend.emails.send({
      from: 'shreyasnandanwar0400@gmail.com',
      to: [userEmail],
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated reminder from your expense tracker.
          </p>
        </div>
      `,
    });

    console.log('Email notification sent:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Placeholder function - implement based on your user model
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // If using Prisma:
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });
    return user?.email || null;

    // If using MongoDB/Mongoose:
    // const User = require('@/models/User');
    // const user = await User.findById(userId).select('email');
    // return user?.email || null;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
}
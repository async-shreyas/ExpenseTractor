import { NextRequest, NextResponse } from 'next/server';
import Reminder from '@/models/Reminder';
import Notification from '@/models/Notification';
import { sendEmailNotification } from '@/lib/notifications';
import { sendWebPushNotification } from '@/lib/webpush';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Security: Check cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const runId = new mongoose.Types.ObjectId();
    const now = new Date();

    // Find due reminders
    const dueReminders = await Reminder.find({
      active: true,
      nextRunAt: { $lte: now },
      $or: [
        { lastRunAt: { $lt: new Date(now.getTime() - 5 * 60 * 1000) } }, // Not run in last 5 minutes
        { lastRunAt: { $exists: false } }
      ]
    });

    console.log(`Found ${dueReminders.length} due reminders`);

    for (const reminder of dueReminders) {
      try {
        // Create in-app notification
        if (reminder.inApp) {
          await Notification.create({
            userId: reminder.userId,
            title: reminder.title,
            body: reminder.message,
            type: 'reminder'
          });
        }

        // Send email notification
        if (reminder.email) {
          await sendEmailNotification(reminder.userId.toString(), reminder.title, reminder.message);
        }

        // Send web push notification
        if (reminder.webPush) {
          await sendWebPushNotification(reminder.userId.toString(), reminder.title, reminder.message);
        }

        // Update reminder
        const nextRunAt = calculateNextRun(reminder.frequency, reminder.nextRunAt);
        await Reminder.findByIdAndUpdate(reminder._id, {
          lastRunAt: now,
          nextRunAt,
          runCount: reminder.runCount + 1
        });

        console.log(`Processed reminder ${reminder._id}`);
      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: { processed: dueReminders.length, runId } 
    });
  } catch (error) {
    console.error('Error running reminders:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

function calculateNextRun(frequency: string, currentRunAt: Date): Date {
  const next = new Date(currentRunAt);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}
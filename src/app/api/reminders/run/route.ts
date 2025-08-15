// app/api/reminders/run/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Reminder from '@/models/Reminder';
import Notification from '@/models/Notification';
import { sendEmailNotification } from '@/lib/notifications';
import { sendWebPushNotification, isWebPushConfigured } from '@/lib/webpush';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Security: Check cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
      console.warn('Unauthorized cron request');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const runId = new mongoose.Types.ObjectId();
    const now = new Date();

    console.log(`Starting cron job run ${runId} at ${now.toISOString()}`);
    console.log('Configuration status:', {
      webPushConfigured: isWebPushConfigured(),
      resendConfigured: !!process.env.RESEND_API_KEY,
      cronSecret: !!process.env.CRON_SECRET
    });

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

    const results = {
      processed: 0,
      errors: 0,
      notifications: {
        inApp: 0,
        email: 0,
        webPush: 0
      }
    };

    for (const reminder of dueReminders) {
      try {
        console.log(`Processing reminder ${reminder._id}: ${reminder.title}`);

        // Create in-app notification
        if (reminder.inApp) {
          try {
            await Notification.create({
              userId: reminder.userId,
              title: reminder.title,
              body: reminder.message,
              type: 'reminder'
            });
            results.notifications.inApp++;
            console.log(`✓ In-app notification created for reminder ${reminder._id}`);
          } catch (error) {
            console.error(`✗ Failed to create in-app notification for reminder ${reminder._id}:`, error);
          }
        }

        // Send email notification
        if (reminder.email) {
          try {
            const emailSent = await sendEmailNotification(
              reminder.userId.toString(), 
              reminder.title, 
              reminder.message
            );
            if (emailSent) {
              results.notifications.email++;
              console.log(`✓ Email notification sent for reminder ${reminder._id}`);
            }
          } catch (error) {
            console.error(`✗ Failed to send email for reminder ${reminder._id}:`, error);
          }
        }

        // Send web push notification
        if (reminder.webPush) {
          try {
            const pushSent = await sendWebPushNotification(
              reminder.userId.toString(), 
              reminder.title, 
              reminder.message
            );
            if (pushSent) {
              results.notifications.webPush++;
              console.log(`✓ Web push notification sent for reminder ${reminder._id}`);
            } else {
              console.log(`⚠ Web push notification skipped for reminder ${reminder._id}`);
            }
          } catch (error) {
            console.error(`✗ Failed to send web push for reminder ${reminder._id}:`, error);
          }
        }

        // Update reminder
        const nextRunAt = calculateNextRun(reminder.frequency, reminder.nextRunAt);
        await Reminder.findByIdAndUpdate(reminder._id, {
          lastRunAt: now,
          nextRunAt,
          runCount: (reminder.runCount || 0) + 1
        });

        results.processed++;
        console.log(`✓ Reminder ${reminder._id} processed successfully. Next run: ${nextRunAt.toISOString()}`);
      } catch (error) {
        results.errors++;
        console.error(`✗ Error processing reminder ${reminder._id}:`, error);
      }
    }

    console.log(`Cron job ${runId} completed:`, results);

    return NextResponse.json({ 
      success: true, 
      data: { 
        runId: runId.toString(),
        timestamp: now.toISOString(),
        ...results,
        config: {
          webPushConfigured: isWebPushConfigured(),
          resendConfigured: !!process.env.RESEND_API_KEY
        }
      } 
    });
  } catch (error) {
    console.error('Error running reminders cron job:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
    default:
      console.warn(`Unknown frequency: ${frequency}, defaulting to daily`);
      next.setDate(next.getDate() + 1);
  }
  
  return next;
}
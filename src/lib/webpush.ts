import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';

let vapidConfigured = false;

function configureVapid() {
  if (vapidConfigured) return true;
  
  // Try both server-side and client-side environment variable names
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (!publicKey || !privateKey) {
    console.warn('VAPID keys not configured, web push notifications will be disabled');
    return false;
  }
  
  try {
    webpush.setVapidDetails(
      'mailto:shreyasnandanwar0400@gmail.com',
      publicKey,
      privateKey
    );
    vapidConfigured = true;
    return true;
  } catch (error) {
    console.error('Failed to configure VAPID details:', error);
    return false;
  }
}

export async function sendWebPushNotification(userId: string, title: string, message: string) {
  try {
    // Configure VAPID only when function is called
    if (!configureVapid()) {
      console.warn('Web push notifications not configured, skipping...');
      return false;
    }

    const subscriptions = await PushSubscription.find({ userId });
    
    if (!subscriptions || subscriptions.length === 0) {
      console.warn(`No push subscriptions found for user ${userId}`);
      return false;
    }
    
    const notificationPayload = JSON.stringify({
      title,
      body: message,
      icon: '/icon.png',
      badge: '/badge.png',
      data: {
        url: '/dashboard',
        userId,
        type: 'reminder'
      }
    });

    let successCount = 0;
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
          console.error('Missing subscription keys, skipping notification for subscription:', subscription._id);
          return;
        }

        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth
            }
          },
          notificationPayload
        );
        
        successCount++;
        console.log(`Push notification sent successfully to subscription ${subscription._id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription expired or invalid, remove it
          console.log(`Removing invalid subscription ${subscription._id}`);
          await PushSubscription.findByIdAndDelete(subscription._id);
        }
        console.error(`Error sending push notification to subscription ${subscription._id}:`, error);
      }
    });

    await Promise.all(sendPromises);
    
    console.log(`Sent ${successCount}/${subscriptions.length} push notifications for user ${userId}`);
    return successCount > 0;
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in sendWebPushNotification:', error);
    return false;
  }
}

// Helper function to check if web push is configured
export function isWebPushConfigured(): boolean {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  return !!(publicKey && privateKey);
}
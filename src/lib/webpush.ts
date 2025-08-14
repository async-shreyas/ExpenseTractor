import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';

// Configure VAPID keys
webpush.setVapidDetails(
  'mailto:shreyasnandanwar0400@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendWebPushNotification(userId: string, title: string, message: string) {
  try {
    const subscriptions = await PushSubscription.find({ userId });
    
    const notificationPayload = JSON.stringify({
      title,
      body: message,
      icon: '/icon.png',
      badge: '/badge.png'
    });

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.statusCode === 410) {
          // Subscription expired, remove it
          await PushSubscription.findByIdAndDelete(subscription._id);
        }
        console.error('Error sending push notification:', error);
      }
    });

    await Promise.all(sendPromises);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in sendWebPushNotification:', error);
    throw error;
  }
}
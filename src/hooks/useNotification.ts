import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotification() {
  const router = useRouter();

  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, any>;
      
      
      if (data?.screen) {
        router.push(data.screen as string);
      }
      if (data?.orderId) {
        router.push({
          pathname: '/(tabs)/ordem',
          params: { id: data.orderId as string },
        });
      }
    });

    return () => subscription.remove();
  }, [router]);

  const sendNotification = async (
    title: string,
    body: string,
    data?: Record<string, any>,
    delayInSeconds: number = 1
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delayInSeconds,
        },
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return { sendNotification };
}

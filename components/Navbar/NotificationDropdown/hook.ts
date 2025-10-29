/* eslint-disable prettier/prettier */

import { useMutation } from '@/hooks/swr';
import { NotificationItem } from '@/interfaces/response';

export const useNotification = () => {
  const notificationList = useMutation<NotificationItem[]>('notification', {
    url: 'notification',
  });

  const unreadNotification = useMutation<NotificationItem[]>(
    'notification-unread',
    {
      url: 'notification-unread',
    },
  );

  const readNotification = useMutation<NotificationItem[]>(
    'notification-read',
    {
      url: 'notification-read',
    },
  );

  const deleteNotification = useMutation<NotificationItem[]>(
    'notification-delete',
    {
      url: 'notification-delete',
    },
  );

  return {
    notificationList,
    unreadNotification,
    readNotification,
    deleteNotification,
  };
};

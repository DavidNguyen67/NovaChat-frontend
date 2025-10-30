/* eslint-disable prettier/prettier */

import { METHOD } from '@/common';
import { useMutation } from '@/hooks/swr';
import { NotificationItem } from '@/interfaces/response';

export const useNotification = () => {
  const notificationList = useMutation<NotificationItem[]>(
    '/api/v1/notification',
    {
      url: '/api/v1/notification',
      method: METHOD.GET,
    },
  );

  const unreadNotification = useMutation<NotificationItem[]>(
    '/api/v1/notification-unread',
    {
      url: '/api/v1/notification-unread',
      method: METHOD.GET,
    },
  );

  const readNotification = useMutation<NotificationItem[]>(
    '/api/v1/notification-read',
    {
      url: '/api/v1/notification-read',
      method: METHOD.GET,
    },
  );

  const deleteNotification = useMutation<NotificationItem[]>(
    '/api/v1/notification-delete',
    {
      url: '/api/v1/notification-delete',
      method: METHOD.GET,
    },
  );

  return {
    notificationList,
    unreadNotification,
    readNotification,
    deleteNotification,
  };
};

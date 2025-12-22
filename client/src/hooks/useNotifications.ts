import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  type: string;
  meta?: {
    productId: string;
    level: 'CRITICAL' | 'LOW';
    stock: number;
    reorderPoint: number;
  };
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.NOTIFICATION.GET_ALL_NOTIFICATIONS);

      setNotificationsEnabled(true);
      setNotifications(res.data.notifications ?? []);
    } catch (err: any) {
      // backend returns 403 / 400 status when disabled
      if (err?.response?.status === 403) {
        setNotificationsEnabled(false);
        setNotifications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    const res = await axiosInstance.get(API_PATHS.ADMIN.NOTIFICATION.UNREAD_COUNT);
    setUnreadCount(res.data.count);
  };

  const markRead = async (id: string) => {
    await axiosInstance.patch(API_PATHS.ADMIN.NOTIFICATION.MARK_AS_READ(id));
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    fetchUnreadCount();
  };

  const markAllRead = async () => {
    await axiosInstance.patch(API_PATHS.ADMIN.NOTIFICATION.MARK_ALL_READ);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchAll,
    markRead,
    markAllRead,
    notificationsEnabled,
  };
}

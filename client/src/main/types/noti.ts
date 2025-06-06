// Notification types and interfaces

export interface TopUpNotificationData {
  transaction: {
    _id: string;
    username: string;
    amount: number;
    description?: string;
  };
  notification: string;
  isAdminNotification?: boolean;
}

export type NotificationType = 'topup:completed' | 'admin:topup-notification' | 'other-type';

export interface NotificationEvent<T = any> {
  type: NotificationType;
  data: T;
} 
export interface EmailLog {
  id: string;
  to: string;
  type: EmailType;
  subject: string;
  status: EmailStatus;
  sentAt?: string | null;
  openedAt?: string | null;
  clickedAt?: string | null;
  error?: string | null;
  createdAt: string;
}

export interface EmailStats {
  totalSent: number;
  pending: number;
  failed: number;
  openRate: number;
  clickRate: number;
  byType: Record<string, number>;
}

export enum EmailType {
  VERIFICATION = 'VERIFICATION',
  WELCOME = 'WELCOME',
  PURCHASE_CONFIRMED = 'PURCHASE_CONFIRMED',
  COURSE_ACCESS = 'COURSE_ACCESS',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  CART_ABANDONED_1H = 'CART_ABANDONED_1H',
  CART_ABANDONED_24H = 'CART_ABANDONED_24H',
  CART_ABANDONED_72H = 'CART_ABANDONED_72H',
  NEW_COUPON = 'NEW_COUPON',
  COUPON_EXPIRING = 'COUPON_EXPIRING',
  BIRTHDAY = 'BIRTHDAY',
  NEW_COURSE = 'NEW_COURSE',
  RECOMPRA = 'RECOMPRA',
  ADMIN_NEW_SALE = 'ADMIN_NEW_SALE',
  ADMIN_NEW_USER = 'ADMIN_NEW_USER',
  ADMIN_NEW_MESSAGE = 'ADMIN_NEW_MESSAGE',
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export interface EmailConfig {
  cartAbandoned1hHours: number;
  cartAbandoned24hHours: number;
  cartAbandoned72hHours: number;
  firstCouponDiscount: number;
  secondCouponDiscount: number;
  cartAbandonedEnabled: boolean;
  birthdayEmailsEnabled: boolean;
}

export interface UpdateEmailConfigData {
  cartAbandonedEnabled?: boolean;
  birthdayEmailsEnabled?: boolean;
  cartAbandoned1hHours?: number;
  cartAbandoned24hHours?: number;
  cartAbandoned72hHours?: number;
  firstCouponDiscount?: number;
  secondCouponDiscount?: number;
}

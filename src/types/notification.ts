export type NotificationType =
  | "STATUS_CHANGED"
  | "NEW_COMMENT"
  | "OFFICIAL_RESPONSE"
  | "FEATURE_RELEASED"
  | "MENTIONED";

export type WebhookEvent =
  | "POST_CREATED"
  | "POST_STATUS_CHANGED"
  | "POST_MERGED"
  | "COMMENT_ADDED"
  | "RELEASE_PUBLISHED";

export type PostSubscription = {
  id: number;
  postId: string;
  voterProfileId: string;
  notifyEmail: boolean;
  notifyInApp: boolean;
  createdAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: Date;
};

export type WebhookSubscription = {
  id: string;
  workspaceId: string;
  targetUrl: string;
  secretKey: string;
  events: WebhookEvent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuditLog = {
  id: number;
  workspaceId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: Date;
};

export type CreateSubscriptionInput = {
  postId: string;
  voterProfileId: string;
  notifyEmail?: boolean;
  notifyInApp?: boolean;
};

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
};

export type CreateWebhookInput = {
  workspaceId: string;
  targetUrl: string;
  events: WebhookEvent[];
};

export type CreateAuditLogInput = {
  workspaceId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
};

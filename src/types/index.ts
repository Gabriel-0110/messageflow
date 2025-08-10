export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  tags: string[];
  customFields: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  type: 'sms' | 'rcs';
  content: string;
  variables: string[];
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RCSTemplate {
  id: string;
  name: string;
  contentSid: string;
  description?: string;
  variables: string[];
  previewData?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  recipientId: string;
  templateId?: string;
  type: 'sms' | 'rcs';
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  twilioSid?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  contactIds: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  readCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalMessages: number;
  sentMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  readMessages: number;
  deliveryRate: number;
  readRate: number;
  recentActivity: {
    date: string;
    sent: number;
    delivered: number;
    failed: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
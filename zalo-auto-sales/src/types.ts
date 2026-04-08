// Zalo Auto Sales — Type Definitions

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  ADMIN_TOKEN?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

// Database models
export interface Token {
  id: string;
  oa_id: string;
  app_id: string;
  app_secret: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string | null;
  oa_secret_key: string;
  display_name: string | null;
  updated_at: string;
}

export interface Sequence {
  id: string;
  name: string;
  description: string | null;
  trigger_event: 'follow' | 'keyword' | 'manual';
  trigger_keyword: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface SequenceStep {
  id: string;
  sequence_id: string;
  step_order: number;
  delay_minutes: number;
  message_type: 'text' | 'image' | 'template';
  template_id: string | null;
  message_content: string;
  media_url: string | null;
  cta_title: string | null;
  cta_url: string | null;
  is_active: number;
  created_at: string;
}

export interface Contact {
  id: string;
  zalo_user_id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  tags: string;
  source: string | null;
  followed_at: string | null;
  last_interaction_at: string | null;
  is_following: number;
  created_at: string;
  updated_at: string;
}

export interface SequenceEnrollment {
  id: string;
  contact_id: string;
  sequence_id: string;
  current_step: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  enrolled_at: string;
  next_send_at: string | null;
  completed_at: string | null;
  paused_at: string | null;
}

export interface MessageLog {
  id: string;
  contact_id: string;
  enrollment_id: string | null;
  step_id: string | null;
  message_type: string | null;
  message_content: string | null;
  zalo_message_id: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  cost_vnd: number;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  error_message: string | null;
  created_at: string;
}

// Zalo API types
export interface ZaloWebhookEvent {
  app_id: string;
  oa_id: string;
  user_id_by_app: string;
  event_name: string;
  timestamp: string;
  source?: string;
  message?: {
    msg_id: string;
    text?: string;
    attachments?: any[];
  };
  follower?: {
    id: string;
  };
  sender?: {
    id: string;
  };
  recipient?: {
    id: string;
  };
}

export interface ZaloSendMessageResponse {
  error: number;
  message: string;
  data?: {
    message_id: string;
  };
}

export interface ZaloTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: number;
  message?: string;
}

export interface ZaloUserProfile {
  user_id: string;
  display_name: string;
  avatar: string;
  user_id_by_app: string;
}

// API request/response types
export interface CreateSequenceRequest {
  name: string;
  description?: string;
  trigger_event?: 'follow' | 'keyword' | 'manual';
  trigger_keyword?: string;
  steps: {
    delay_minutes: number;
    message_type?: 'text' | 'image' | 'template';
    template_id?: string;
    message_content: string;
    media_url?: string;
    cta_title?: string;
    cta_url?: string;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ContactMetadata {
  id: string;
  contact_id: string;
  field_key: string;
  field_value: string | null;
  created_at: string;
}

export interface AIConfig {
  id: string;
  enabled: number;
  provider: string;
  api_key: string | null;
  model: string;
  system_prompt: string;
  max_tokens: number;
  temperature: number;
  escalation_keywords: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  contact_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface HumanTask {
  id: string;
  contact_id: string;
  enrollment_id: string | null;
  task_type: string;
  priority: 'urgent' | 'normal' | 'low';
  title: string;
  description: string | null;
  message_suggestion: string | null;
  zalo_user_id: string | null;
  contact_name: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assigned_to: string | null;
  created_at: string;
  completed_at: string | null;
  notes: string | null;
}

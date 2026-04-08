-- Zalo Auto Sales — D1 Schema
-- Drip Sequence Platform for HKD via Zalo OA API

-- OAuth tokens (auto-refresh)
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY DEFAULT 'default',
  oa_id TEXT,
  app_id TEXT,
  app_secret TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  access_token_expires_at TEXT NOT NULL,
  refresh_token_expires_at TEXT,
  oa_secret_key TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Chuỗi chăm sóc
CREATE TABLE IF NOT EXISTS sequences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT DEFAULT 'follow',
  trigger_keyword TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Các bước trong chuỗi
CREATE TABLE IF NOT EXISTS sequence_steps (
  id TEXT PRIMARY KEY,
  sequence_id TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  message_type TEXT DEFAULT 'text',
  template_id TEXT,
  message_content TEXT NOT NULL,
  media_url TEXT,
  cta_title TEXT,
  cta_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE
);

-- Contacts (followers/users)
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  zalo_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  tags TEXT DEFAULT '[]',
  source TEXT,
  followed_at TEXT,
  last_interaction_at TEXT,
  is_following INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Enrollment tracking
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  sequence_id TEXT NOT NULL,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  enrolled_at TEXT DEFAULT (datetime('now')),
  next_send_at TEXT,
  completed_at TEXT,
  paused_at TEXT,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE,
  UNIQUE(contact_id, sequence_id)
);

-- Message logs
CREATE TABLE IF NOT EXISTS message_logs (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  enrollment_id TEXT,
  step_id TEXT,
  message_type TEXT,
  message_content TEXT,
  zalo_message_id TEXT,
  status TEXT DEFAULT 'pending',
  cost_vnd INTEGER DEFAULT 0,
  sent_at TEXT,
  delivered_at TEXT,
  read_at TEXT,
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_next_send ON sequence_enrollments(next_send_at, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_contact ON sequence_enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_contacts_zalo_uid ON contacts(zalo_user_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_contact ON message_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_steps_sequence ON sequence_steps(sequence_id, step_order);

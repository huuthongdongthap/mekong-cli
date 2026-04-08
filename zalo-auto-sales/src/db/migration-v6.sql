CREATE TABLE IF NOT EXISTS human_tasks (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  enrollment_id TEXT,
  task_type TEXT DEFAULT 'send_message',
  priority TEXT DEFAULT 'normal',
  title TEXT NOT NULL,
  description TEXT,
  message_suggestion TEXT,
  zalo_user_id TEXT,
  contact_name TEXT,
  status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  notes TEXT,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON human_tasks(status, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON human_tasks(priority, status);

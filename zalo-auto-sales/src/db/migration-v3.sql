-- AI reply configuration
CREATE TABLE IF NOT EXISTS ai_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  enabled INTEGER DEFAULT 1,
  provider TEXT DEFAULT 'google',
  api_key TEXT,
  model TEXT DEFAULT 'gemini-2.0-flash',
  system_prompt TEXT DEFAULT 'Bạn là trợ lý bán hàng của cửa hàng. Trả lời ngắn gọn, thân thiện, bằng tiếng Việt. Nếu không biết câu trả lời, hướng dẫn khách liên hệ hotline.',
  max_tokens INTEGER DEFAULT 500,
  temperature REAL DEFAULT 0.7,
  escalation_keywords TEXT DEFAULT '["gặp người", "nhân viên", "hotline", "khiếu nại"]',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- AI conversation history (for context)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ai_conv_contact ON ai_conversations(contact_id, created_at);

-- Insert default config
INSERT OR IGNORE INTO ai_config (id) VALUES ('default');

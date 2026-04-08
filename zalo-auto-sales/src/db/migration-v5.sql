-- Tracking events for funnel
CREATE TABLE IF NOT EXISTS funnel_events (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT,
  oa_id TEXT DEFAULT 'default',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_funnel_event_type ON funnel_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_contact ON funnel_events(contact_id);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS conversions (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  sequence_id TEXT,
  conversion_type TEXT DEFAULT 'purchase',
  value_vnd INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON conversions(created_at);

-- Add click tracking to message_logs
ALTER TABLE message_logs ADD COLUMN clicked_at TEXT;
ALTER TABLE message_logs ADD COLUMN click_url TEXT;

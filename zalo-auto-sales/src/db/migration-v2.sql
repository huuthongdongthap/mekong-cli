-- Migration V2: Contact Metadata (key-value store per contact)

CREATE TABLE IF NOT EXISTS contact_metadata (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_value TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  UNIQUE(contact_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_metadata_contact ON contact_metadata(contact_id);
CREATE INDEX IF NOT EXISTS idx_metadata_key ON contact_metadata(contact_id, field_key);

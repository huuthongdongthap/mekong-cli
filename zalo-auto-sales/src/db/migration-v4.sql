-- Migration v4: Multi-OA support
-- Thêm cột oa_id vào sequences (gắn sequence với OA cụ thể)
ALTER TABLE sequences ADD COLUMN oa_id TEXT DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_sequences_oa ON sequences(oa_id);

-- Thêm cột oa_id vào contacts
ALTER TABLE contacts ADD COLUMN oa_id TEXT DEFAULT 'default';

-- Thêm cột oa_id vào message_logs
ALTER TABLE message_logs ADD COLUMN oa_id TEXT DEFAULT 'default';

-- Thêm cột display_name vào tokens để hiện tên OA
ALTER TABLE tokens ADD COLUMN display_name TEXT;

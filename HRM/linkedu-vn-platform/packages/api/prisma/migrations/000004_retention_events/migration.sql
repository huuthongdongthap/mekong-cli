-- Retention tracking tables for LaunchDarkly retroactive analysis

CREATE TABLE IF NOT EXISTS retention_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  variant VARCHAR(255) NOT NULL,
  flag_key VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT now(),
  properties JSONB DEFAULT '{}',
  UNIQUE(user_id, flag_key)
);

CREATE TABLE IF NOT EXISTS user_disco_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  flag_key VARCHAR(255) NOT NULL,
  score FLOAT NOT NULL,
  computed_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retention_events_flag_user
  ON retention_events(flag_key, user_id);

CREATE INDEX IF NOT EXISTS idx_retention_events_timestamp
  ON retention_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_disco_scores_flag_user
  ON user_disco_scores(flag_key, user_id);

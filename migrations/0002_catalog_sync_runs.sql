CREATE TABLE IF NOT EXISTS catalog_sync_runs (
  run_id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  channel_count INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  error_summary TEXT
);

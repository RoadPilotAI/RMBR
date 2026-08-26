export const SCHEMA_VERSION = 2;

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contexts (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('work','home','personal','custom')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_sources (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  context_id TEXT NOT NULL REFERENCES contexts(id),
  source_type TEXT NOT NULL DEFAULT 'ics',
  secure_storage_key TEXT NOT NULL,
  last_successful_sync_at TEXT,
  sync_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY NOT NULL,
  calendar_source_id TEXT NOT NULL REFERENCES calendar_sources(id) ON DELETE CASCADE,
  external_uid TEXT NOT NULL,
  title TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  time_zone TEXT,
  location TEXT,
  description TEXT,
  all_day INTEGER NOT NULL DEFAULT 0,
  recurrence_rule TEXT,
  last_seen_at TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(calendar_source_id, external_uid)
);

CREATE TABLE IF NOT EXISTS responsibilities (
  id TEXT PRIMARY KEY NOT NULL,
  context_id TEXT NOT NULL REFERENCES contexts(id),
  name TEXT NOT NULL,
  description TEXT,
  definition_of_done TEXT,
  monitoring_rule TEXT,
  recurrence_rule TEXT,
  default_lead_time INTEGER,
  expected_duration INTEGER,
  required_location TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  next_review_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY NOT NULL,
  responsibility_id TEXT REFERENCES responsibilities(id),
  context_id TEXT NOT NULL REFERENCES contexts(id),
  title TEXT NOT NULL,
  context_packet TEXT,
  status TEXT NOT NULL DEFAULT 'inbox'
    CHECK(status IN ('inbox','planned','ready','in_progress','waiting','blocked','done','cancelled')),
  do_at TEXT,
  due_at TEXT,
  start_by TEXT,
  estimated_duration INTEGER,
  actual_duration INTEGER,
  required_location TEXT,
  waiting_for TEXT,
  blocked_by TEXT,
  completed_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS planning_blocks (
  id TEXT PRIMARY KEY NOT NULL,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK(status IN ('proposed','confirmed','conflict','cancelled')),
  source TEXT NOT NULL DEFAULT 'user' CHECK(source IN ('user','system')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY NOT NULL,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK(type IN ('start','escalation','deadline','transition','follow_up')),
  escalation_level INTEGER NOT NULL DEFAULT 0,
  platform_notification_id TEXT,
  state TEXT NOT NULL DEFAULT 'scheduled'
    CHECK(state IN ('scheduled','delivered','actioned','dismissed','cancelled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plan_conflicts (
  id TEXT PRIMARY KEY NOT NULL,
  planning_block_id TEXT NOT NULL REFERENCES planning_blocks(id) ON DELETE CASCADE,
  calendar_event_id TEXT NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  detected_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS external_prompts (
  id TEXT PRIMARY KEY NOT NULL,
  occurred_at TEXT NOT NULL,
  context_id TEXT REFERENCES contexts(id),
  task_id TEXT REFERENCES tasks(id),
  responsibility_id TEXT REFERENCES responsibilities(id),
  note TEXT
);
`;

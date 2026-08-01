CREATE TABLE IF NOT EXISTS service_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cost INTEGER NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    duration_minutes INTEGER NOT NULL,
    buffer_override_minutes INTEGER DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS general_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    worker_name TEXT NOT NULL,
    rolling_schedule_length INTEGER NOT NULL DEFAULT 60,
    buffer_minutes INTEGER NOT NULL DEFAULT 15,
    timezone TEXT NOT NULL DEFAULT 'America/New_York'
);

CREATE TABLE IF NOT EXISTS day_schedule (
    id INTEGER PRIMARY KEY,
    start_time TEXT,
    end_time TEXT,
    is_working INTEGER NOT NULL
);
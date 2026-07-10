CREATE TABLE IF NOT EXISTS service_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cost INTEGER NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    buffer_override_minutes INTEGER DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS general_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    barber_name TEXT NOT NULL,
    buffer_minutes INTEGER DEFAULT 15
);

CREATE TABLE IF NOT EXISTS weekly_schedule (
    id INTEGER PRIMARY KEY,
    start_time TEXT,
    end_time TEXT,
    is_working INTEGER NOT NULL
);
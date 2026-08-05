INSERT INTO service_type (name, cost, description, duration_minutes, buffer_override_minutes, is_active) VALUES
    ('Buzz Cut', 2000, 'Short clipper cut, all one length.', 15, NULL, 1),
    ('Classic Haircut', 3000, 'Scissor and clipper cut with styling.', 30, NULL, 1),
    ('Beard Trim', 1500, 'Shape and trim facial hair.', 15, NULL, 1),
    ('Haircut + Beard', 4000, 'Full haircut combined with a beard trim.', 45, 5, 1),
    ('Hot Towel Shave', 3500, 'Straight razor shave with hot towel prep.', 40, 10, 1);

INSERT INTO general_settings (id, worker_name, rolling_schedule_length, buffer_minutes, timezone) VALUES
    (1, 'Buck Harris', 60, 15, 'America/New_York');

INSERT INTO day_schedule (id, start_time, end_time, is_working) VALUES
    (0, NULL, NULL, 0),
    (1, '09:00', '17:00', 1),
    (2, '09:00', '17:00', 1),
    (3, '09:00', '17:00', 1),
    (4, '09:00', '17:00', 1),
    (5, '09:00', '18:00', 1),
    (6, '10:00', '15:00', 1);

INSERT INTO client_notes (client_identifier, client_name, last_service_type_id, notes, updated_at) VALUES
    ('555-0101', 'Jordan Lee', 2, 'Wants a bit more taper on the sides next time, mentioned starting a new job.', '2026-07-20 14:30:00'),
    ('555-0142', 'Sam Rivera', 4, 'Prefers the beard kept short and square, talked about his upcoming trip to Portugal.', '2026-07-28 10:15:00');

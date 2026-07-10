INSERT INTO service_type (name, cost, description, duration_minutes, buffer_override_minutes) VALUES
    ('Buzz Cut', 2000, 'Short clipper cut, all one length.', 15, NULL),
    ('Classic Haircut', 3000, 'Scissor and clipper cut with styling.', 30, NULL),
    ('Beard Trim', 1500, 'Shape and trim facial hair.', 15, NULL),
    ('Haircut + Beard', 4000, 'Full haircut combined with a beard trim.', 45, 5),
    ('Hot Towel Shave', 3500, 'Straight razor shave with hot towel prep.', 40, 10);

INSERT INTO general_settings (id, barber_name, buffer_minutes) VALUES
    (1, 'Buck Harris', 15);

INSERT INTO weekly_schedule (id, start_time, end_time, is_working) VALUES
    (0, NULL, NULL, 0),
    (1, '09:00', '17:00', 1),
    (2, '09:00', '17:00', 1),
    (3, '09:00', '17:00', 1),
    (4, '09:00', '17:00', 1),
    (5, '09:00', '18:00', 1),
    (6, '10:00', '15:00', 1);

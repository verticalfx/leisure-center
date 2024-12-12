-- Insert facilities
INSERT INTO facilities (name, description, open_time, close_time)
VALUES 
    ('Yoga Studio', 'A peaceful yoga space with mats and props', '06:00:00', '22:00:00'),
    ('Gym Hall', 'A large hall equipped with modern fitness machines', '06:00:00', '22:00:00'),
    ('Swimming Pool', 'A heated indoor pool with lanes for swimming', '06:00:00', '21:00:00');

-- Insert users (instructors)
INSERT INTO users (first_name, last_name, date_of_birth, email, phone_number, registration_date, password, role_id)
VALUES 
    ('Alice', 'Smith', '1990-01-01', 'alice@example.com', '555-123-4567', CURDATE(), 'hashedpassword', 2),
    ('Bob', 'Johnson', '1985-05-10', 'bob@example.com', '555-987-6543', CURDATE(), 'hashedpassword', 2),
    ('Carol', 'Davis', '1992-03-15', 'carol@example.com', '555-567-8901', CURDATE(), 'hashedpassword', 2);

-- Insert sample classes
INSERT INTO classes (name, facility_id, schedule, start_time, end_time, instructor_id)
VALUES 
    ('Morning Yoga', 1, '2024-12-15', '07:00:00', '08:00:00', 1), -- Yoga Studio, Alice
    ('Advanced Pilates', 1, '2024-12-15', '08:30:00', '09:30:00', 1), -- Yoga Studio, Alice
    ('HIIT Training', 2, '2024-12-15', '09:00:00', '09:45:00', 2), -- Gym Hall, Bob
    ('Strength Training', 2, '2024-12-15', '10:00:00', '11:00:00', 2), -- Gym Hall, Bob
    ('Swimming Basics', 3, '2024-12-15', '11:00:00', '12:00:00', 3), -- Swimming Pool, Carol
    ('Aquatic Aerobics', 3, '2024-12-15', '12:30:00', '13:30:00', 3); -- Swimming Pool, Carol

-- Optionally register some users for these classes
INSERT INTO users (first_name, last_name, date_of_birth, email, phone_number, registration_date, password, role_id)
VALUES 
    ('John', 'Doe', '1995-03-15', 'john@example.com', '555-777-8888', CURDATE(), 'hashedpassword', 1),
    ('Jane', 'Doe', '1998-07-20', 'jane@example.com', '555-111-2222', CURDATE(), 'hashedpassword', 1);

INSERT INTO user_classes (user_id, class_id, registration_date)
VALUES 
    (4, 1, CURDATE()), -- John registers for Morning Yoga
    (5, 3, CURDATE()); -- Jane registers for HIIT Training
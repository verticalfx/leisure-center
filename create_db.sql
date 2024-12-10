DROP TABLE IF EXISTS user_classes;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

DROP DATABASE IF EXISTS leisure_center;

CREATE DATABASE leisure_center;
USE leisure_center;

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

INSERT INTO roles (role_name) VALUES ('Member'), ('Employee');

CREATE TABLE facilities (
    facility_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL
);

CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    facility_id INT NOT NULL,
    schedule DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    instructor_id INT NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

CREATE TABLE user_classes (
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    registration_date DATE NOT NULL,
    PRIMARY KEY (user_id, class_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'adminpassword';
GRANT ALL PRIVILEGES ON leisure_center.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;

-- Views
CREATE VIEW user_with_roles AS
SELECT u.id AS user_id, u.first_name, u.last_name, u.email, r.role_name, u.date_of_birth, u.phone_number, u.registration_date
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- For the schedule, include instructor name and compute duration in the application layer:
CREATE VIEW class_schedules AS
SELECT c.class_id, c.name AS class_name, f.name AS facility_name, c.schedule, c.start_time, c.end_time,
       CONCAT(u.first_name, ' ', u.last_name) AS instructor_name
FROM classes c
JOIN facilities f ON c.facility_id = f.facility_id
JOIN users u ON c.instructor_id = u.id;

-- Reviews view remains the same:
CREATE VIEW class_reviews AS
SELECT rev.review_id, c.name AS class_name, CONCAT(u.first_name, ' ', u.last_name) AS reviewer,
       rev.rating, rev.comment, rev.review_date
FROM reviews rev
JOIN classes c ON rev.class_id = c.class_id
JOIN users u ON rev.user_id = u.id;

-- Procedures as before (optional)
DELIMITER //
CREATE PROCEDURE get_classes_by_date(IN class_date DATE)
BEGIN
    SELECT c.class_id, c.name AS class_name, f.name AS facility_name, c.schedule, c.start_time, c.end_time,
           CONCAT(u.first_name, ' ', u.last_name) AS instructor_name
    FROM classes c
    JOIN facilities f ON c.facility_id = f.facility_id
    JOIN users u ON c.instructor_id = u.id
    WHERE c.schedule = class_date
    ORDER BY c.start_time;
END//
DELIMITER ;

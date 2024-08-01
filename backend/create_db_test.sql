-- Create the database
CREATE DATABASE IF NOT EXISTS test;

-- Use the database
USE test;

-- Create the Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Locations table
CREATE TABLE Locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(50)
);

-- Create the venue_types table
CREATE TABLE venue_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(100) NOT NULL,
    type_desc tinytext
);

-- Create the features table
CREATE TABLE features (
    feature_id INT PRIMARY KEY AUTO_INCREMENT,
    feature_name VARCHAR(100) NOT NULL,
    feature_desc tinytext
);

-- Create the venues table
CREATE TABLE venues (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount_per_day DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    capacity INT,
    location_id INT,
    type_id INT,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES venue_types(type_id) ON DELETE CASCADE
);

-- Create the venue_features table
CREATE TABLE venue_features (
    venue_id INT,
    feature_id INT,
    PRIMARY KEY (venue_id, feature_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(feature_id) ON DELETE CASCADE
);

-- Create the reservations table
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    venue_id INT,
    start_date DATE NOT NULL DEFAULT '2024-01-01',
    end_date DATE NOT NULL DEFAULT '2024-01-01',
    start_time TIME NOT NULL DEFAULT '00:00:00',
    end_time TIME NOT NULL DEFAULT '00:00:00',
    status ENUM('successful', 'rejected', 'pending') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);

-- Create the reviews table
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    venue_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);

-- Create the Payments table
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('successful', 'rejected', 'pending') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);

-- Create the venue_images table
CREATE TABLE venue_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);

-- Insert dummy users
INSERT INTO Users (username, password_hash, email, first_name, last_name, is_admin) VALUES
('john_doe', 'hash1', 'john@example.com', 'John', 'Doe', FALSE),
('jane_smith', 'hash2', 'jane@example.com', 'Jane', 'Smith', TRUE),
('bob_jones', 'hash3', 'bob@example.com', 'Bob', 'Jones', FALSE);

-- Insert dummy locations
INSERT INTO Locations (city, state, country) VALUES
('New York', 'NY', 'USA'),
('Los Angeles', 'CA', 'USA'),
('London', '', 'UK');

-- Insert dummy venue types
INSERT INTO venue_types (type_name, type_desc) VALUES
('Conference Hall', 'A large hall suitable for conferences and large meetings.'),
('Banquet Hall', 'A hall suitable for banquets and receptions.'),
('Outdoor Space', 'An open outdoor space suitable for events.');

-- Insert dummy features
INSERT INTO features (feature_name, feature_desc) VALUES
('WiFi', 'High-speed wireless internet access.'),
('Projector', 'High-resolution projector for presentations.'),
('Parking', 'On-site parking available.');

-- Insert dummy venues
INSERT INTO venues (venue_name, description, amount_per_day, capacity, location_id, type_id) VALUES
('Grand Conference Hall', 'A grand hall for large conferences.', 500.00, 300, 1, 1),
('Elegant Banquet Hall', 'A beautifully decorated hall for banquets.', 700.00, 200, 2, 2),
('Sunny Outdoor Space', 'A spacious outdoor area perfect for events.', 300.00, 500, 3, 3);

-- Insert dummy venue features
INSERT INTO venue_features (venue_id, feature_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3);

-- Insert dummy reservations
INSERT INTO reservations (user_id, venue_id, start_date, end_date, start_time, end_time, status) VALUES
(1, 1, '2024-09-01', '2024-09-01', '09:00:00', '17:00:00', 'successful'),
(2, 2, '2024-10-05', '2024-10-05', '18:00:00', '23:00:00', 'pending'),
(3, 3, '2024-08-15', '2024-08-15', '10:00:00', '14:00:00', 'rejected');

-- Insert dummy reviews
INSERT INTO reviews (user_id, venue_id, rating, comment) VALUES
(1, 1, 5, 'Fantastic venue with great facilities!'),
(2, 2, 4, 'Beautiful hall, but the parking was a bit crowded.'),
(3, 3, 3, 'Nice outdoor space, but could use more shade.');

-- Insert dummy payments
INSERT INTO Payments (reservation_id, amount, payment_status) VALUES
(1, 500.00, 'successful'),
(2, 700.00, 'pending'),
(3, 300.00, 'rejected');

-- Insert dummy venue images
INSERT INTO venue_images (venue_id, image_url) VALUES
(1, 'http://example.com/images/venue1.jpg'),
(2, 'http://example.com/images/venue2.jpg'),
(3, 'http://example.com/images/venue3.jpg');

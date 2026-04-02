CREATE DATABASE IF NOT EXISTS lienurbainproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lienurbainproject;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    roles JSON NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    photo VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    user_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE announcement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    user_id INT NOT NULL,
    category_id INT DEFAULT NULL,
    CONSTRAINT fk_announcement_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_announcement_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

INSERT INTO category (name, created_at) VALUES
('Bricolage', NOW()),
('Soutien scolaire', NOW()),
('Animaux', NOW()),
('Informatique', NOW()),
('Jardinage', NOW());

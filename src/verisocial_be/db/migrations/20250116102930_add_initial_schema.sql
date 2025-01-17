-- Add migration script here
CREATE TABLE IF NOT EXISTS users 
(
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    bot_score TINYINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Revert this migration.
DROP TABLE users;
-- Add migration script here
CREATE TABLE IF NOT EXISTS users 
(
    user_id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, -- can change
    email VARCHAR(100) NOT NULL UNIQUE, -- can change
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    bot_score FLOAT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- {user_id} -> {usename, email, password_hash, full_name, bio, bot_score, created_at }

CREATE TABLE IF NOT EXISTS follow 
(
    follower_id BIGINT UNSIGNED UNIQUE,
    followee_id BIGINT UNSIGNED UNIQUE,
    PRIMARY KEY (followee_id, follower_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users(user_id) ON DELETE CASCADE
);

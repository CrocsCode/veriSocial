-- Add up migration script here
CREATE TABLE IF NOT EXISTS gameEvents 
(
    event_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    correct_post_id BIGINT UNSIGNED NOT NULL,
    wrong_post_id BIGINT UNSIGNED NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- Add up migration script here
CREATE TABLE IF NOT EXISTS reports
(
    report_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    post_id BIGINT UNSIGNED NOT NULL,
    ai_content BOOLEAN NOT NULL,
    bot_behaviour BOOLEAN NOT NULL,
    other BOOLEAN NOT NULL,
    additional_details VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    -- Add constraint to ensure at least one is added.
    CONSTRAINT chk_options_at_least_one_true
        CHECK (
            (ai_content + bot_behaviour + other) >= 1
        )
);
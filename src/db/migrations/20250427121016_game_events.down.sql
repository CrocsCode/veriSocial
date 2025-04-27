-- Add down migration script here
CREATE TABLE IF NOT EXITS gameEvents 
(
    event_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    used_id BIGINT USIGNED NOT NULL,
    correct_post_id BIGINT NOT NULL,
    wrong_post_id BIGINT NOT NULL,
    is_correct BOOLEAN NOT NULL
);
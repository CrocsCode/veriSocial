-- Add up migration script here
CREATE TABLE IF NOT EXISTS likes 
(
    like_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    post_id BIGINT UNSIGNED,
    comment_id BIGINT UNSIGNED,
    UNIQUE KEY unique_user_like (user_id, post_id, comment_id), 
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

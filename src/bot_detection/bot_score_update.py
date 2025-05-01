import yaml
from mysql.connector.cursor import MySQLCursorDict
from mysql.connector.pooling import MySQLConnectionPool

try:
    cfg = yaml.safe_load(open("config.yaml")) or {}
    MULTIPLIER = cfg.get("update", {}).get("multiplier", 0.1)
except Exception:
    MULTIPLIER = 0.1

def update_bot_scores( preds: list[int], user_order: list[str], cursor: MySQLCursorDict, db: MySQLConnectionPool):
    for user, pred in zip(user_order, preds):
        print(user, pred)
        update_operation(user, pred, cursor, db)

def update_operation(user_id, pred, cursor: MySQLCursorDict, db: MySQLConnectionPool):
    try:
        cursor.execute("SELECT bot_score FROM users WHERE user_id = %s FOR UPDATE", (user_id,))
        bot_score = cursor.fetchone()["bot_score"]

        new_score_if_bot = bot_score + (pred * MULTIPLIER * -1) # Minus one if bot (turns value positive)
        new_score_if_human = bot_score - (pred * MULTIPLIER)

        if pred == -1 and new_score_if_bot < 1 : # Stop if score goes above 0
            cursor.execute("UPDATE users SET bot_score = %s WHERE user_id = %s", (new_score_if_bot, user_id,))
        elif pred == -1 and new_score_if_human >= 0: # Stops if score goes below 0
            cursor.execute("UPDATE users SET bot_score = %s WHERE user_id = %s", (new_score_if_human, user_id,))
        
        db.commit()

    except Exception as e:
        print("Transaction failed: ", e)
        db.rollback()

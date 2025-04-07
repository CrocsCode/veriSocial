from mysql.connector.cursor import MySQLCursorDict
from mysql.connector.pooling import MySQLConnectionPool


def update_bot_scores(preds: list[int], user_order: list[str], cursor: MySQLCursorDict, db: MySQLConnectionPool):
    i = 0
    for user in user_order:
        update_operation(user, preds[i], cursor, db)
        i += 1

def update_operation(user_id, pred, cursor: MySQLCursorDict, db: MySQLConnectionPool):
    try:
        cursor.execute("SELECT bot_score FROM users WHERE user_id = %s FOR UPDATE", (user_id,))
        bot_score = cursor.fetchone()["bot_score"]
    
        if bot_score > -1:
            new_score = bot_score + (pred * -0.1) # I want to set a multiplier for weights.
            cursor.execute("UPDATE users SET bot_score = %s WHERE user_id = %s", (new_score, user_id,))
        
        db.commit()

    except Exception as e:
        print("Transaction failed: ", e)
        db.rollback()

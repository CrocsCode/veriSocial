import numpy as np
from mysql.connector.cursor import MySQLCursorDict
from sklearn.preprocessing import StandardScaler


def get_sql_query_results(cursor: MySQLCursorDict):
    # Execute query.
    cursor.execute("""
        WITH user_activity AS (
            SELECT user_id, created_at AS timestamp FROM posts
            UNION ALL
            SELECT user_id, created_at AS timestamp FROM comments
            UNION ALL
            SELECT user_id, created_at AS timestamp FROM likes
        ),
        intervals AS (
            SELECT
                user_id,
                timestamp,
                TIMESTAMPDIFF(SECOND, LAG(timestamp) OVER (PARTITION BY user_id ORDER BY timestamp), timestamp) AS diff_seconds
            FROM user_activity
        )
        SELECT
            user_id,
            COUNT(*) AS total_actions,
            AVG(diff_seconds) AS avg_interval,
            STDDEV(diff_seconds) AS std_interval,
            SUM(CASE
                    WHEN diff_seconds < 60
                    THEN 1 ELSE 0 
                END) AS burst_count
        FROM intervals
        GROUP BY user_id;
    """)

    results = cursor.fetchall()

    return results


def parse_sql_results(sql_results: list):  
    # Converting from SQL Dicts to NumPy arrays
    feature_list = []

    for row in sql_results:
        features = [
            row["total_actions"],
            row["avg_interval"],
            row["std_interval"],
            row["burst_count"]
        ]
        feature_list.append(features)

    return np.array(feature_list)

def get_scaled_features(cursor: MySQLCursorDict):
    # Scaled feature matrix
    sql_results = get_sql_query_results(cursor)

    if len(sql_results) == 0:
        print("NO DATA IN DB")
        return None
    else:
        X = parse_sql_results(sql_results)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        return X_scaled, sql_results

import numpy as np
from sklearn.preprocessing import StandardScaler

def get_sql_query_results():
    # TEMP DATA
    data = [
        {"user_id": 1,  "total_actions": 20, "avg_interval": 30, "std_interval": 6,   "burst_count": 2},
        {"user_id": 2,  "total_actions": 22, "avg_interval": 32, "std_interval": 5, "burst_count": 2},
        {"user_id": 3,  "total_actions": 18, "avg_interval": 28, "std_interval": 6, "burst_count": 4},
        {"user_id": 4,  "total_actions": 19, "avg_interval": 29, "std_interval": 5, "burst_count": 3},
        {"user_id": 5,  "total_actions": 21, "avg_interval": 31, "std_interval": 6,   "burst_count": 3},
        {"user_id": 6,  "total_actions": 20, "avg_interval": 30, "std_interval": 6,   "burst_count": 3},
        {"user_id": 7,  "total_actions": 19, "avg_interval": 27, "std_interval": 6.2, "burst_count": 3},
        {"user_id": 8,  "total_actions": 20, "avg_interval": 29, "std_interval": 6,   "burst_count": 2},
        {"user_id": 9,  "total_actions": 21, "avg_interval": 31, "std_interval": 5, "burst_count": 3},
        {"user_id": 10, "total_actions": 18, "avg_interval": 28, "std_interval": 6, "burst_count": 4},
        {"user_id": 11, "total_actions": 20, "avg_interval": 30, "std_interval": 6,   "burst_count": 3},
        {"user_id": 12, "total_actions": 22, "avg_interval": 32, "std_interval": 5.8, "burst_count": 2},
        {"user_id": 13, "total_actions": 19, "avg_interval": 29, "std_interval": 6.3, "burst_count": 3},
        {"user_id": 14, "total_actions": 20, "avg_interval": 30, "std_interval": 6,   "burst_count": 3},
        {"user_id": 15, "total_actions": 18, "avg_interval": 28, "std_interval": 6.2, "burst_count": 4},
        {"user_id": 16, "total_actions": 21, "avg_interval": 31, "std_interval": 6,   "burst_count": 3},
        # users 17-20 are "bots"
        {"user_id": 17, "total_actions": 300, "avg_interval": 2,   "std_interval": 1, "burst_count": 100},
        {"user_id": 18, "total_actions": 350, "avg_interval": 1.5, "std_interval": 0.4, "burst_count": 120},
        {"user_id": 19, "total_actions": 280, "avg_interval": 2.5, "std_interval": 0.6, "burst_count": 90},
        {"user_id": 20, "total_actions": 400, "avg_interval": 1,   "std_interval": 0.3, "burst_count": 150},
        {"user_id": 21, "total_actions": 21, "avg_interval": 31, "std_interval": 6,   "burst_count": 3},
        {"user_id": 22, "total_actions": 19, "avg_interval": 29, "std_interval": 6,   "burst_count": 4},
        {"user_id": 23, "total_actions": 20, "avg_interval": 30, "std_interval": 5.5, "burst_count": 3},
        {"user_id": 24, "total_actions": 18, "avg_interval": 28, "std_interval": 6.2, "burst_count": 3},
        {"user_id": 25, "total_actions": 22, "avg_interval": 32, "std_interval": 5.8, "burst_count": 2},
        {"user_id": 26, "total_actions": 20, "avg_interval": 30, "std_interval": 6.0, "burst_count": 3},
        {"user_id": 27, "total_actions": 19, "avg_interval": 29, "std_interval": 6.1, "burst_count": 4},
        {"user_id": 28, "total_actions": 21, "avg_interval": 31, "std_interval": 6,   "burst_count": 3},
        {"user_id": 29, "total_actions": 20, "avg_interval": 30, "std_interval": 6.3, "burst_count": 3},
        {"user_id": 30, "total_actions": 18, "avg_interval": 28, "std_interval": 6,   "burst_count": 3},
        {"user_id": 31, "total_actions": 21, "avg_interval": 31, "std_interval": 5.9, "burst_count": 2},
        {"user_id": 32, "total_actions": 20, "avg_interval": 30, "std_interval": 6.2, "burst_count": 3},
        {"user_id": 33, "total_actions": 19, "avg_interval": 29, "std_interval": 6,   "burst_count": 3},
        {"user_id": 34, "total_actions": 22, "avg_interval": 32, "std_interval": 5.8, "burst_count": 3},
        {"user_id": 35, "total_actions": 20, "avg_interval": 30, "std_interval": 6,   "burst_count": 2},
        {"user_id": 36, "total_actions": 21, "avg_interval": 31, "std_interval": 6,   "burst_count": 3},
        # users 37-40 are "bots"
        {"user_id": 37, "total_actions": 320, "avg_interval": 2.0, "std_interval": 0.4, "burst_count": 110},
        {"user_id": 38, "total_actions": 350, "avg_interval": 1.8, "std_interval": 0.5, "burst_count": 120},
        {"user_id": 39, "total_actions": 280, "avg_interval": 2.2, "std_interval": 0.6, "burst_count": 100},
        {"user_id": 40, "total_actions": 400, "avg_interval": 1.2, "std_interval": 0.3, "burst_count": 150},
    ]
    return data


def parse_sql_results(sql_results):
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

def get_scaled_features():
    # Scaled feature matrix
    sql_results = get_sql_query_results()
    X = parse_sql_results(sql_results)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled

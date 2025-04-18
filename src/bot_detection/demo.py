import sys
import types

# ─── Stub out mysql.connector so sql_data imports work ──────────────────────
mysql = types.ModuleType("mysql")
mysql.connector = types.ModuleType("mysql.connector")
mysql.connector.cursor = types.ModuleType("mysql.connector.cursor")
mysql.connector.pooling = types.ModuleType("mysql.connector.pooling")
mysql.connector.cursor.MySQLCursorDict = object
mysql.connector.pooling.MySQLConnectionPool = object
sys.modules["mysql"] = mysql
sys.modules["mysql.connector"] = mysql.connector
sys.modules["mysql.connector.cursor"] = mysql.connector.cursor
sys.modules["mysql.connector.pooling"] = mysql.connector.pooling

# ─── Fallback for sklearn.preprocessing.StandardScaler ────────────────────
try:
    from sklearn.preprocessing import StandardScaler
except ImportError:
    class StandardScaler:
        def fit_transform(self, X):
            return X

# ─── Fallback for parse_sql_results if sql_data can't import ───────────────
try:
    from sql_data import parse_sql_results
except ImportError:
    import numpy as np
    def parse_sql_results(sql_results):
        return np.array([
            [r["total_actions"], r["avg_interval"], r["std_interval"], r["burst_count"]]
            for r in sql_results
        ])

# ─── Now your real analysis modules ────────────────────────────────────────
import yaml
import numpy as np

from analysis.one_class_svm   import one_class_svm_detection
from analysis.lof            import lof_detection
from analysis.isolation_forest import IsolationForest
from analysis.ensemble       import combine_predictions

def load_ensemble_config(path="config.yaml"):
    """
    Load ensemble weights and threshold from YAML,
    fallback to defaults if missing.
    """
    defaults = {
        "one_class_svm":    0.5,
        "lof":               0.5,
        "isolation_forest":  2.0,
        "threshold":         0.0,
    }
    try:
        cfg = yaml.safe_load(open(path)) or {}
        ann = cfg.get("anomaly", {})
        w   = ann.get("weights", {})
        weights = [
            w.get("one_class_svm",    defaults["one_class_svm"]),
            w.get("lof",               defaults["lof"]),
            w.get("isolation_forest",  defaults["isolation_forest"]),
        ]
        threshold = ann.get("threshold", defaults["threshold"])
        return weights, threshold
    except Exception:
        return [
            defaults["one_class_svm"],
            defaults["lof"],
            defaults["isolation_forest"],
        ], defaults["threshold"]

def demo():
    # 1) Load & print config
    weights, threshold = load_ensemble_config()
    print("=== Loaded ensemble config from config.yaml ===")
    print(f"weights → one_class_svm: {weights[0]}, lof: {weights[1]}, isolation_forest: {weights[2]}")
    print(f"threshold → {threshold}\n")

    # 2) Mock SQL results
    sql_results = [
    {"user_id": "u1",  "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 2},
    {"user_id": "u2",  "total_actions": 22,  "avg_interval": 32,  "std_interval": 5.0,  "burst_count": 2},
    {"user_id": "u3",  "total_actions": 18,  "avg_interval": 28,  "std_interval": 6.0,  "burst_count": 4},
    {"user_id": "u4",  "total_actions": 19,  "avg_interval": 29,  "std_interval": 5.0,  "burst_count": 3},
    {"user_id": "u5",  "total_actions": 21,  "avg_interval": 31,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u6",  "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u7",  "total_actions": 19,  "avg_interval": 27,  "std_interval": 6.2,  "burst_count": 3},
    {"user_id": "u8",  "total_actions": 20,  "avg_interval": 29,  "std_interval": 6.0,  "burst_count": 2},
    {"user_id": "u9",  "total_actions": 21,  "avg_interval": 31,  "std_interval": 5.0,  "burst_count": 3},
    {"user_id": "u10", "total_actions": 18,  "avg_interval": 28,  "std_interval": 6.0,  "burst_count": 4},
    {"user_id": "u11", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u12", "total_actions": 22,  "avg_interval": 32,  "std_interval": 5.8,  "burst_count": 2},
    {"user_id": "u13", "total_actions": 19,  "avg_interval": 29,  "std_interval": 6.3,  "burst_count": 3},
    {"user_id": "u14", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u15", "total_actions": 18,  "avg_interval": 28,  "std_interval": 6.2,  "burst_count": 4},
    {"user_id": "u16", "total_actions": 21,  "avg_interval": 31,  "std_interval": 6.0,  "burst_count": 3},
    # bots:
    {"user_id": "u17", "total_actions": 300, "avg_interval": 2,   "std_interval": 1.0,  "burst_count": 100},
    {"user_id": "u18", "total_actions": 350, "avg_interval": 1.5, "std_interval": 0.4,  "burst_count": 120},
    {"user_id": "u19", "total_actions": 280, "avg_interval": 2.5, "std_interval": 0.6,  "burst_count": 90},
    {"user_id": "u20", "total_actions": 400, "avg_interval": 1.0, "std_interval": 0.3,  "burst_count": 150},
    {"user_id": "u21", "total_actions": 21,  "avg_interval": 31,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u22", "total_actions": 19,  "avg_interval": 29,  "std_interval": 6.0,  "burst_count": 4},
    {"user_id": "u23", "total_actions": 20,  "avg_interval": 30,  "std_interval": 5.5,  "burst_count": 3},
    {"user_id": "u24", "total_actions": 18,  "avg_interval": 28,  "std_interval": 6.2,  "burst_count": 3},
    {"user_id": "u25", "total_actions": 22,  "avg_interval": 32,  "std_interval": 5.8,  "burst_count": 2},
    {"user_id": "u26", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u27", "total_actions": 19,  "avg_interval": 29,  "std_interval": 6.1,  "burst_count": 4},
    {"user_id": "u28", "total_actions": 21,  "avg_interval": 31,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u29", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.3,  "burst_count": 3},
    {"user_id": "u30", "total_actions": 18,  "avg_interval": 28,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u31", "total_actions": 21,  "avg_interval": 31,  "std_interval": 5.9,  "burst_count": 2},
    {"user_id": "u32", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.2,  "burst_count": 3},
    {"user_id": "u33", "total_actions": 19,  "avg_interval": 29,  "std_interval": 6.0,  "burst_count": 3},
    {"user_id": "u34", "total_actions": 22,  "avg_interval": 32,  "std_interval": 5.8,  "burst_count": 3},
    {"user_id": "u35", "total_actions": 20,  "avg_interval": 30,  "std_interval": 6.0,  "burst_count": 2},
    {"user_id": "u36", "total_actions": 21,  "avg_interval": 31,  "std_interval": 6.0,  "burst_count": 3},
    # more bots:
    {"user_id": "u37", "total_actions": 320, "avg_interval": 2.0, "std_interval": 0.4,  "burst_count": 110},
    {"user_id": "u38", "total_actions": 350, "avg_interval": 1.8, "std_interval": 0.5,  "burst_count": 120},
    {"user_id": "u39", "total_actions": 280, "avg_interval": 2.2, "std_interval": 0.6,  "burst_count": 100},
    {"user_id": "u40", "total_actions": 400, "avg_interval": 1.2, "std_interval": 0.3,  "burst_count": 150},
    ]
    print("=== Mock SQL results ===")
    for row in sql_results:
        print(" ", row)
    print()

    # 3) Raw feature matrix
    raw_feats = parse_sql_results(sql_results)
    print("=== Raw feature matrix ===")
    print(raw_feats, "\n")

    # 4) Scaled features
    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(raw_feats)
    print("=== Scaled features ===")
    print(x_scaled, "\n")

    # 5) Detector predictions
    _, svm_preds = one_class_svm_detection(x_scaled)
    print("OneClass SVM preds:       ", svm_preds)

    _, lof_preds = lof_detection(x_scaled)
    print("Local Outlier Factor preds:", lof_preds)

    forest = IsolationForest(n_estimators=100, max_samples=256, random_state=42, contamination=0.25)
    forest.fit(x_scaled)
    _, if_preds = forest.predict(x_scaled)
    print("Isolation Forest preds:   ", if_preds, "\n")

    # 6) Ensemble
    weighted_scores, final_preds = combine_predictions(svm_preds, lof_preds, if_preds, weights=weights, threshold=threshold)
    print("Weighted scores: ", weighted_scores)
    print("Final preds:     ", final_preds, "\n")

    # 7) Simulated update_bot_scores calls
    print("=== Simulated update_bot_scores calls ===")
    for user, pred in zip([r["user_id"] for r in sql_results], final_preds):
        print(f" update_bot_scores(user_id={user}, pred={pred})")

if __name__ == "__main__":
    demo()

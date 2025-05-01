# Data collection
from sql_data import get_scaled_features
import mysql.connector

# Update
from bot_score_update import update_bot_scores

# Analysis
from analysis.one_class_svm import one_class_svm_detection
from analysis.lof import lof_detection
from analysis.isolation_forest import IsolationForest
from analysis.ensemble import combine_predictions
import yaml

def load_db_config(path="config.yaml"):
    cfg = yaml.safe_load(open(path)) or {}
    db = cfg.get("database", {})
    return {
        "host": db.get("host", "localhost"),
        "port": db.get("port", 3306),
        "user": db.get("user", "root"),
        "password": db.get("password", ""),
        "database": db.get("name", ""),
    }


def load_ensemble_config(path="config.yaml"):
    defaults = {
        "one_class_svm": 0.5,    # incase not given any values
        "lof": 0.5,
        "isolation_forest": 2.0,
        "threshold":0.0,
    }
    try:
        cfg = yaml.safe_load(open(path)) or {}
        ann = cfg.get("anomaly", {})
        w = ann.get("weights", {})
        return [
            w.get("one_class_svm",    defaults["one_class_svm"]),
            w.get("lof",               defaults["lof"]),
            w.get("isolation_forest",  defaults["isolation_forest"]),
        ], ann.get("threshold", defaults["threshold"])
    except Exception:
        # if error thendefaults
        return [
            defaults["one_class_svm"],
            defaults["lof"],
            defaults["isolation_forest"],
        ], defaults["threshold"]

def main():
    weights, threshold = load_ensemble_config()

    # Instantiate db
    db_cfg = load_db_config("config.yaml")
    db = mysql.connector.connect(**db_cfg)
    cursor = db.cursor(dictionary=True)

    db.rollback()
    results = get_scaled_features(cursor)

    if results is not None:
        x_scaled, users = results
    else:
        return None

    user_order = [user["user_id"] for user in users]
    
    # OneClass SVM detection
    _, svm_preds = one_class_svm_detection(x_scaled)

    # LocalOutlierFactor detection.
    _, lof_preds = lof_detection(x_scaled)

    # IsolationForest detection.
    forest = IsolationForest(n_estimators=100, max_samples=256, random_state=42, contamination=0.25)
    forest.fit(x_scaled)
    _, if_preds = forest.predict(x_scaled)

    # Combine Predictions
    weighted_scores, final_preds = combine_predictions(svm_preds, lof_preds, if_preds, weights=[0.5, 0.5, 2], threshold=0)

    # Update bot scores.
    update_bot_scores(final_preds, user_order, cursor, db)

    # Cleanup
    cursor.close()
    db.close()
    
    
if __name__ == "__main__":
    main()

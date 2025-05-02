# Data collection
from sql_data import get_scaled_features
import mysql.connector

# Update
from bot_score_update import update_bot_scores
from config import *

# Schedule run
import time
import schedule
import threading
import sys
import signal

# Analysis
from analysis.one_class_svm import one_class_svm_detection
from analysis.lof import lof_detection
from analysis.isolation_forest import IsolationForest
from analysis.ensemble import combine_predictions

# Flag for stopping event
stop_event = threading.Event()

def analyze():
    print("\nStarting work")
    weights, threshold = load_ensemble_config()
    # interval_minutes = load_time_interval() # NEW CODE ADDED HERE

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
    print("\nEnding work")

def _handle_signal(signum, _):
    # first signal sets the flag; any further signal forces immediate exit
    if not stop_event.is_set():
        print(f"\nReceived signal {signum}, will shut down gracefully…")
        stop_event.set()
    else:
        print(f"\nReceived signal {signum} again, forcing exit.", file=sys.stderr)
        sys.exit(1)


def main():
    # install our handlers for Ctrl-C and `kill`
    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)

    interval_minutes = load_time_interval()
    print(f"Scheduled every: {interval_minutes} minutes")
    schedule.every(interval_minutes).minutes.do(analyze)
 
    while not stop_event.is_set():
        schedule.run_pending()
        time.sleep(1)

    print("Shutdown flag detected.")

if __name__ == "__main__":
    main()

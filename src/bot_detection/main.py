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

def main():
    # Instantiate db
    db = mysql.connector.connect(
        host="localhost",
        port="3306",
        user="root",
        password="my-secret-pw",
        database="mydatabase"
    )
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

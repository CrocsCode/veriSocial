from sql_data import get_scaled_features
from one_class_svm import one_class_svm_detection
from lof import lof_detection
from isolation_forest import IsolationForest
from ensemble import combine_predictions

def main():
    x_scaled = get_scaled_features()
    # print("Scaled Feature Data:") # DEBUG
    # print(x_scaled)
    # print("\n")
    
    # OneClass SVM detection
    svm_scores, svm_preds = one_class_svm_detection(x_scaled)
    print("One Class SVM Preds:")
    print(svm_preds)
    print("\n")
    
    # LocalOutlierFactor detection.
    lof_scores, lof_preds = lof_detection(x_scaled)
    print("LOF Preds:")
    print(lof_preds)
    print("\n")
    
    # IsolationForest detection.
    forest = IsolationForest(n_estimators=100, max_samples=256, random_state=42, contamination=0.25)
    forest.fit(x_scaled)
    if_scores, if_preds = forest.predict(x_scaled)
    print("IF Preds:")
    print(if_preds)
    print("\n")
    
    # Combine Predictions
    weighted_scores, final_preds = combine_predictions(svm_preds, lof_preds, if_preds, weights=[0.5, 0.5, 2], threshold=0)
    print("Ensemble Weighted:")
    print(weighted_scores)
    print("\n")
    print("Final:")
    print(final_preds)
    
if __name__ == "__main__":
    main()

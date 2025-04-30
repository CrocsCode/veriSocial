import numpy as np

#Combine the arrays from different predictions
def combine_predictions(svm_preds, lof_preds, if_preds, weights=None, threshold=0):
    if weights is None:
        weights = [1, 1, 2] # IF NO WEIGHTS GIVEN

    svm_preds = np.array(svm_preds)
    lof_preds = np.array(lof_preds)
    if_preds  = np.array(if_preds)
    
    # Compute weighted calc.
    weighted_scores = weights[0] * svm_preds + weights[1] * lof_preds + weights[2] * if_preds
    # Decide final prediction: if weighted score is less than threshold, flag as anomaly (-1), else normal (1)
    final_preds = np.where(weighted_scores < threshold, -1, 1)
    return weighted_scores, final_preds

from sklearn.neighbors import LocalOutlierFactor

def lof_detection(X_scaled, n_neighbors=3, contamination=0.25):
    lof = LocalOutlierFactor(n_neighbors=n_neighbors, contamination=contamination)
    predictions = lof.fit_predict(X_scaled)
    scores = -lof.negative_outlier_factor_ 
    return scores, predictions

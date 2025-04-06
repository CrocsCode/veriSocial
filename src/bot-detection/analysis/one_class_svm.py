from sklearn.svm import OneClassSVM

def one_class_svm_detection(X_scaled):
    ocsvm = OneClassSVM(nu=0.25, kernel="rbf", gamma="scale")
    ocsvm.fit(X_scaled)
    predictions = ocsvm.predict(X_scaled)
    scores = ocsvm.decision_function(X_scaled)
    anomaly_scores = -scores
    return anomaly_scores, predictions

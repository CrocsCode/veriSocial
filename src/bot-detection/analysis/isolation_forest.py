import numpy as np
import math
import random

GAMMA = 0.5772156649 # Constant (Euler's) for average baseline
def harmonic(n):
    if n > 0:
        return math.log(n) + GAMMA
    return 0

def c(n): #Calculates expected path length (normalisation)
    if n <= 1:
        return 0
    return 2 * harmonic(n - 1) - (2 * (n - 1) / n)

class IsolationTree:
    def __init__(self, X, current_depth=0, max_depth=None):
        self.current_depth = current_depth
        self.n_samples = X.shape[0]
        self.max_depth = max_depth if max_depth is not None else math.ceil(math.log2(self.n_samples))
        self.is_leaf = False
        self.feature = None
        self.split = None
        self.left = None
        self.right = None

        if self.n_samples <= 1 or self.current_depth >= self.max_depth: # Stop Split if reach max depth
            self.is_leaf = True
        else:
            n_features = X.shape[1]
            valid_features = [i for i in range(n_features) if np.min(X[:, i]) < np.max(X[:, i])] # select features ()

            if not valid_features:
                self.is_leaf = True
                return
            
            self.feature = random.choice(valid_features)
            min_val = np.min(X[:, self.feature])
            max_val = np.max(X[:, self.feature])
            self.split = random.uniform(min_val, max_val)
            left_mask = X[:, self.feature] < self.split
            right_mask = ~left_mask

            if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
                self.is_leaf = True
                return
            
            self.left = IsolationTree(X[left_mask], current_depth=self.current_depth + 1, max_depth=self.max_depth)
            self.right = IsolationTree(X[right_mask], current_depth=self.current_depth + 1, max_depth=self.max_depth)

    def path_length(self, x):
        # Calculates number of splits for isolation
        if self.is_leaf:
            return self.current_depth + c(self.n_samples)
        if x[self.feature] < self.split:
            return self.left.path_length(x)
        else:
            return self.right.path_length(x)

# Class to build many random forests for comparisons later
class IsolationForest:
    def __init__(self, n_estimators=100, max_samples=256, random_state=None, contamination=0.25):
        self.n_estimators = n_estimators
        self.max_samples = max_samples
        self.contamination = contamination
        self.trees = []

        if random_state is not None:
            random.seed(random_state)
            np.random.seed(random_state)

    def fit(self, X):
        self.trees = [] # Forest (many trees)
        n_total = X.shape[0]
        self.psi = min(self.max_samples, n_total)

        for _ in range(self.n_estimators):
            
            if self.psi < n_total:
                indices = np.random.choice(n_total, self.psi, replace=False)
                X_sub = X[indices]
            else:
                X_sub = X
            tree = IsolationTree(X_sub)
            self.trees.append(tree)

    # calculate average path length of ALL trees
    def average_path_length(self, x):
        lengths = [tree.path_length(x) for tree in self.trees]
        return np.mean(lengths)
    
    # calculate anomaly score
    def decision_function(self, X):
        scores = np.array([2 ** (-self.average_path_length(x) / c(self.psi)) for x in X])
        return scores

    def compute_threshold(self, scores):
        return np.percentile(scores, 100 * (1 - self.contamination))

    def predict(self, X):
        scores = self.decision_function(X)
        threshold = self.compute_threshold(scores)
        # compare results and input either 1 or -1 if below threshold
        predictions = np.where(scores >= threshold, -1, 1)
        return scores, predictions

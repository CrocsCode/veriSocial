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

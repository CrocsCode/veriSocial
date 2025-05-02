import yaml

def load_db_config(path="config.yaml"):
    cfg = yaml.safe_load(open(path)) or {}
    return {
        "host": cfg.get("database_host", "localhost"),
        "port": cfg.get("database_port", 3306),
        "user": cfg.get("database_user", "root"),
        "password": cfg.get("database_secret", ""),
        "database": cfg.get("database_name", ""),
    }

def load_ensemble_config(path="config.yaml"):
    defaults = {
        "one_class_svm": 0.5, # incase not given any values
        "lof": 0.5,
        "isolation_forest": 2.0,
        "threshold":0.0,
    }
    try:
        cfg = yaml.safe_load(open(path)) or {}
        ann = cfg.get("anomaly", {})
        w = ann.get("weights", {})
        return [
            w.get("one_class_svm", defaults["one_class_svm"]),
            w.get("lof", defaults["lof"]),
            w.get("isolation_forest", defaults["isolation_forest"]),
        ], ann.get("threshold", defaults["threshold"])
    except Exception:
        # if error thendefaults
        return [
            defaults["one_class_svm"],
            defaults["lof"],
            defaults["isolation_forest"],
        ], defaults["threshold"]

def load_time_interval(path="config.yaml"):
    defaults = { 
        "minutes": 30 
    }
    try:
        cfg = yaml.safe_load(open(path)) or {}
        ti  = cfg.get("time_interval", {})
        return ti.get("minutes", defaults["minutes"])
    except Exception:
        return defaults["minutes"]

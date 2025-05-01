import yaml
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_host: str
    database_port: int
    database_user: str
    database_password: str
    database_name: str
    bucket_name: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str

    class Config:
        env_file = ".env"

def load_settings(path: str = "config.yml") -> Settings:
    defaults = {
        "database_host": "localhost",
        "database_port": 3306,
        "database_user": "root",
        "database_password": "",
        "database_name": "",
        "bucket_name": "",
        "aws_access_key_id": "",
        "aws_secret_access_key": "",
        "aws_region": "us-west-2",
    }
    try:
        cfg = yaml.safe_load(open(path)) or {}
    except Exception:
        cfg = {}
    data = {
        key: cfg.get(key, defaults[key])
        for key in defaults
    }

    return Settings(**data)
settings = load_settings()

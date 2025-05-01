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

settings = Settings()
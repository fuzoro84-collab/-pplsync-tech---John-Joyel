from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    MONGO_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "dashdb"

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"

settings = Settings()

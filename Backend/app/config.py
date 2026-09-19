from pydantic import BaseSettings
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel


class Settings(BaseSettings):
    MONGO_URI: str
    MONGO_INITDB_DATABASE: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    USE_CREDENTIALS: bool
    VALIDATE_CERTS: bool
    EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES: int
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    FRONTEND_URL: str

    class Config:
        env_file = ".env"


settings = Settings()


class JWTSettings(BaseModel):
    authjwt_secret_key: str = settings.JWT_SECRET_KEY
    authjwt_token_location: set = {"cookies"}
    authjwt_cookie_csrf_protect: bool = True


@AuthJWT.load_config
def get_config():
    return JWTSettings()

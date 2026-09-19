from fastapi import HTTPException, status
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pymongo.database import Database
from app.models.user_model import UserDB
from app.models.schema import UserCreate
from app.config import settings
from jose import jwt, JWTError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password) 


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def set_access_token_cookie(response, Authorize: AuthJWT, subject: str):
    access_token = Authorize.create_access_token(
        subject=subject, expires_time=timedelta(days=3))
    Authorize.set_access_cookies(access_token, response)
    return access_token


def clear_access_token_cookie(response, Authorize: AuthJWT):
    Authorize.unset_jwt_cookies(response)


class AuthService:
    def __init__(self, db: Database):
        self.db = db

    async def register_user(self, payload: UserCreate):
        user_in_db = await self.db.users.find_one({"email": payload.email})
        if user_in_db:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Account already exists")

        sequence_doc = await self.db.counters.find_one_and_update(
            {'_id': 'user_id'},
            {'$inc': {'sequence_value': 1}},
            upsert=True,
            return_document=True
        )
        user_id = sequence_doc['sequence_value']

        hashed_password = hash_password(payload.password)

        user = UserDB(
            _id=user_id,
            full_name=payload.full_name,
            email=payload.email,
            password=hashed_password,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        await self.db.users.insert_one(user.dict(by_alias=True))

        await self.send_verification_email(user)

        return {"message": "Registration successful. Please check your email to verify your account."}

    async def login_user(self, email, password, Authorize, response):
        user_data = await self.db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="User with this email does not exist. Please create an account first.")

        user = UserDB(**user_data)

        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password provided.")

        if not user.is_verified:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Please verify your email first")

        access_token = set_access_token_cookie(response, Authorize, user.email)
        return {"access_token": access_token}

    async def get_user_by_email(self, email: str):
        user_data = await self.db.users.find_one({"email": email})
        if not user_data:
            return None
        return UserDB(**user_data)

    async def verify_user_email(self, email: str, token: str):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[
                                 settings.JWT_ALGORITHM])
            if payload['sub'] != email:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        result = await self.db.users.update_one({"email": email}, {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}})
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return {"message": "Email verified successfully"}

    async def send_verification_email(self, user: UserDB):
        token_data = {
            "sub": user.email,
            "exp": datetime.utcnow() + timedelta(minutes=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES)
        }
        token = jwt.encode(token_data, settings.JWT_SECRET_KEY,
                           algorithm=settings.JWT_ALGORITHM)

        verification_link = f"{settings.FRONTEND_URL}/verify-email?email={user.email}&token={token}"

        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - DermaAI</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    background-color: #0c111f;
                    color: #e2e8f0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #111827;
                    border: 1px solid #374151;
                    border-radius: 16px;
                    overflow: hidden;
                }}
                .header {{
                    padding: 24px;
                    text-align: center;
                    background: linear-gradient(90deg, #1e3a8a, #14b8a6);
                }}
                .header h1 {{
                    margin: 0;
                    color: #ffffff;
                    font-size: 28px;
                }}
                .content {{
                    padding: 32px;
                    text-align: center;
                }}
                .content p {{
                    font-size: 16px;
                    line-height: 1.5;
                    color: #9ca3af;
                }}
                .button {{
                    display: inline-block;
                    margin-top: 24px;
                    padding: 14px 28px;
                    background: linear-gradient(90deg, #3b82f6, #14b8a6);
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 8px;
                    font-size: 16px;
                }}
                .footer {{
                    padding: 24px;
                    text-align: center;
                    font-size: 12px;
                    color: #6b7280;
                    border-top: 1px solid #374151;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>DermaAI</h1>
                </div>
                <div class="content">
                    <h2 style="color: #ffffff; font-size: 24px;">Confirm Your Email Address</h2>
                    <p>Thank you for signing up for DermaAI. To complete your registration, please click the button below to verify your email address.</p>
                    <a href="{verification_link}" class="button">Verify Email</a>
                    <p style="margin-top: 24px;">If you did not create an account, no further action is required.</p>
                </div>
                <div class="footer">
                    &copy; {datetime.utcnow().year} DermaAI. All Rights Reserved.
                </div>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Verify your email for DermaAI",
            recipients=[user.email],
            body=html_content,
            subtype="html"
        )

        conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            USE_CREDENTIALS=settings.USE_CREDENTIALS,
            VALIDATE_CERTS=settings.VALIDATE_CERTS
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    async def request_new_verification_token(self, email: str):
        user_data = await self.db.users.find_one({"email": email})

        if not user_data:
            raise HTTPException(
                status_code=404, detail="User with this email does not exist. Please create an account first.")

        user = UserDB(**user_data)

        if user.is_verified:
            raise HTTPException(
                status_code=400, detail="This account is already verified.")

        await self.send_verification_email(user)
        return {"message": f"A new verification email has been sent to {email}."}

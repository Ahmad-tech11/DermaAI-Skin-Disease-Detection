from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_jwt_auth import AuthJWT
from pymongo.database import Database
from app.models.user_model import UserDB, get_db
from app.models.schema import UserCreate, EmailVerificationSchema, EmailSchema
from app.services.auth_services import AuthService

router = APIRouter()


# Dependency provider for AuthService
def get_auth_service(db: Database = Depends(get_db)):
    return AuthService(db)


async def get_current_user(
    Authorize: AuthJWT = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserDB:
    Authorize.jwt_required()
    current_user_email = Authorize.get_jwt_subject()
    user = await auth_service.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.register_user(payload)


@router.post("/login")
async def login(
    response: Response,
    Authorize: AuthJWT = Depends(),
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.login_user(form_data.username, form_data.password, Authorize, response)


@router.post("/logout")
def logout(response: Response, Authorize: AuthJWT = Depends()):
    Authorize.unset_jwt_cookies()
    response.status_code = status.HTTP_200_OK
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserDB)
async def get_me(current_user: UserDB = Depends(get_current_user)):
    return current_user


@router.get("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    payload: EmailVerificationSchema = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.verify_user_email(payload.email, payload.token)


@router.post("/request-verification-token", status_code=status.HTTP_200_OK)
async def request_verification_token(
    payload: EmailSchema,
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.request_new_verification_token(payload.email)

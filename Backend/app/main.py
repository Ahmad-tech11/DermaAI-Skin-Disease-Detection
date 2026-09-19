from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, predict, guest, history
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi.responses import JSONResponse
from pymongo.errors import ServerSelectionTimeoutError

app = FastAPI(
    title="DermaAI API",
    description="FastAPI backend with image classification, JWT auth, Cloudinary, and MongoDB",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "X-CSRF-TOKEN"],
)


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


@app.exception_handler(ServerSelectionTimeoutError)
async def db_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Database connection error. Please try again later."}
    )


@app.get("/")
async def read_root():
    return {"message": "Welcome to the DermaAI API! Visit /docs for API documentation."}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(guest.router, prefix="/api/guest", tags=["Guest"])
app.include_router(history.router, prefix="/api/history", tags=["History"])

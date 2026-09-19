from fastapi import APIRouter, File, UploadFile, Depends
from pymongo.database import Database
from app.models.user_model import get_db, UserDB
from app.services.prediction_services import predict_and_save
from app.api.auth import get_current_user

router = APIRouter()


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Database = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    result = await predict_and_save(file=file, db=db, user_id=current_user.id)
    return result

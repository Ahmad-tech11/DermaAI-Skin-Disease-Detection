from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from pymongo.database import Database
from app.models.user_model import get_db
from app.services.prediction_services import predict_and_save

router = APIRouter()


@router.post("/guest-predict")
async def guest_predict(
    file: UploadFile = File(...),
    db: Database = Depends(get_db)
):
    try:
        result = await predict_and_save(file=file, db=db, user_id=None)

        return {
            "disease": result["disease"],
            "confidence": round(result["confidence"], 2)
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Prediction failed: {str(e)}")

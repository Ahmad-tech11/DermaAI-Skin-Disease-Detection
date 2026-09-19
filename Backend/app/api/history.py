from fastapi import APIRouter, Depends
from app.models.user_model import UserDB
from app.services.history_services import HistoryService
from app.api.auth import get_current_user
from pymongo.database import Database
from app.models.user_model import get_db

router = APIRouter()


def get_history_service(db: Database = Depends(get_db)):
    return HistoryService(db)


@router.get("/")
async def get_history(
    current_user: UserDB = Depends(get_current_user),
    history_service: HistoryService = Depends(get_history_service)
):
    return await history_service.get_user_history(current_user.id)


@router.delete("/{history_id}", status_code=200)
async def delete_history(
    history_id: str,
    current_user: UserDB = Depends(get_current_user),
    history_service: HistoryService = Depends(get_history_service)
):

    return await history_service.delete_history_item(history_id, current_user.id)

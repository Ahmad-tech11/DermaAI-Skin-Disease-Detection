from pymongo.database import Database
from fastapi import HTTPException


class HistoryService:
    def __init__(self, db: Database):
        self.db = db

    async def get_user_history(self, user_id: int):
        history_cursor = self.db.history.find({"user_id": user_id})
        history_list = await history_cursor.to_list(length=None)
        # Rename _id to id so the frontend can reference item.id
        for item in history_list:
            item["id"] = item.pop("_id")
        return history_list

    async def delete_history_item(self, history_id: str, user_id: int):
        # Convert string ID to integer since _id is stored as int in MongoDB
        try:
            history_id_int = int(history_id)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=400, detail="Invalid history ID format.")

        # Find and delete the specific history item for the specific user
        delete_result = await self.db.history.delete_one({"_id": history_id_int, "user_id": user_id})

        if delete_result.deleted_count == 0:
            raise HTTPException(
                status_code=404, detail="History item not found or you do not have permission to delete it.")

        return {"message": "History item deleted successfully."}

from fastapi import UploadFile, HTTPException
from pymongo.database import Database
from datetime import datetime
import numpy as np
from tensorflow import keras
import tensorflow_hub as hub
from app.utils.image_utils import preprocess_image, is_skin_image
from app.utils.cloudinary_helper import upload_to_cloudinary
from app.models.schema import PredictionHistory

# Recreate the model architecture and load only the weights
feature_extractor_url = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/feature_vector/4"
feature_extractor_layer = hub.KerasLayer(
    feature_extractor_url,
    input_shape=(224, 224, 3),
    trainable=False
)

model = keras.Sequential([
    feature_extractor_layer,
    keras.layers.Dense(8, activation='softmax')
])

model.load_weights("models/my_model_weights.h5")

CLASS_NAMES = [
    'Cellulitis', 'Impetigo', 'Athlete Foot', 'Nail Fungus',
    'Ringworm', 'Cutaneous Larva Migrans', 'Chickenpox', 'Shingles'
]

# Minimum confidence threshold (%) — predictions below this are rejected
CONFIDENCE_THRESHOLD = 50.0

# Default fallback result for invalid / unrecognized images
NO_DISEASE_RESULT = {
    "disease": "No Disease Detected",
    "confidence": 0.0,
    "is_valid_prediction": False,
}


async def predict_and_save(
    file: UploadFile,
    db: Database,
    user_id: int = None
):
    """
    Preprocesses an image, validates it as a skin image, gets a prediction
    from the model, and applies a confidence threshold.

    Validation pipeline:
      1. Skin detection heuristic (HSV color-space) — skips model if no skin found
      2. Confidence threshold (50%) — overrides low-confidence predictions

    If either check fails, returns "No Disease Detected" with 0% confidence.
    """
    image_bytes = await file.read()

    # Upload image to Cloudinary first (needed for both valid and invalid results)
    try:
        image_url = upload_to_cloudinary(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to upload image: {str(e)}")

    # --- VALIDATION STEP 1: Skin detection heuristic ---
    if not is_skin_image(image_bytes):
        result = {**NO_DISEASE_RESULT, "image_url": image_url}

        # Save to history even for invalid predictions (so user sees what they uploaded)
        if user_id:
            await _save_history(db, user_id, result)

        return result

    # --- MODEL PREDICTION ---
    preprocessed_image = preprocess_image(image_bytes)
    prediction = model.predict(preprocessed_image)
    predicted_class_index = np.argmax(prediction)
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    confidence = float(np.max(prediction) * 100)

    # --- VALIDATION STEP 2: Confidence threshold ---
    if confidence < CONFIDENCE_THRESHOLD:
        result = {**NO_DISEASE_RESULT, "image_url": image_url}

        if user_id:
            await _save_history(db, user_id, result)

        return result

    # --- VALID PREDICTION ---
    result = {
        "disease": predicted_class_name,
        "confidence": confidence,
        "image_url": image_url,
        "is_valid_prediction": True,
    }

    if user_id:
        await _save_history(db, user_id, result)

    return result


async def _save_history(db: Database, user_id: int, result: dict):
    """Helper to save a prediction result to the user's history."""
    try:
        sequence_doc = await db.counters.find_one_and_update(
            {'_id': 'history_id'},
            {'$inc': {'sequence_value': 1}},
            upsert=True,
            return_document=True
        )
        history_id = sequence_doc['sequence_value']

        history_entry = PredictionHistory(
            _id=history_id,
            user_id=user_id,
            disease=result["disease"],
            confidence=result["confidence"],
            image_url=result["image_url"],
            timestamp=datetime.utcnow()
        )
        await db.history.insert_one(history_entry.dict(by_alias=True))
    except Exception as e:
        print(f"Error saving history: {str(e)}")

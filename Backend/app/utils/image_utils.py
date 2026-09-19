import cv2
import numpy as np


def preprocess_image(image_bytes: bytes) -> np.ndarray:

    image_array = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    resized_img = cv2.resize(img_rgb, (224, 224))
    scaled_img = resized_img / 255.0
    preprocessed_img = np.expand_dims(scaled_img, axis=0)

    return preprocessed_img


def is_skin_image(image_bytes: bytes, threshold: float = 0.15) -> bool:
    """
    Heuristic check to determine if an image likely contains skin.
    Uses HSV color-space analysis to detect skin-tone pixels.
    Returns True if the proportion of skin-colored pixels exceeds the threshold.

    The dual HSV range covers a broad spectrum of skin tones (light to dark).
    """
    image_array = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if img_bgr is None:
        return False

    img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    # HSV range 1: covers lighter skin tones
    lower_skin_1 = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin_1 = np.array([20, 255, 255], dtype=np.uint8)

    # HSV range 2: covers reddish / darker skin tones (wraps around hue)
    lower_skin_2 = np.array([170, 20, 70], dtype=np.uint8)
    upper_skin_2 = np.array([180, 255, 255], dtype=np.uint8)

    mask1 = cv2.inRange(img_hsv, lower_skin_1, upper_skin_1)
    mask2 = cv2.inRange(img_hsv, lower_skin_2, upper_skin_2)
    skin_mask = cv2.bitwise_or(mask1, mask2)

    skin_ratio = np.count_nonzero(skin_mask) / skin_mask.size

    return skin_ratio >= threshold

from flask import Blueprint, request, jsonify
from ultralytics import YOLO
import os
from PIL import Image
import io
import numpy as np

ml_bp = Blueprint('ml', __name__)

# Load model
# Adjust path as necessary. Assuming 'Machine Learning' folder is in the root of the workspace,
# and we are running from 'BackEnd' directory.
# We might need to go up one level if 'Machine Learning' is a sibling of 'BackEnd'.
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Machine Learning', 'best.pt')

model = None

def load_model():
    global model
    if model is None:
        try:
            print(f"Loading model from: {MODEL_PATH}")
            model = YOLO(MODEL_PATH)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")

from flask_jwt_extended import jwt_required

@ml_bp.route('/detect_disease', methods=['POST'])
@jwt_required()
def detect_disease():
    global model
    if model is None:
        load_model()
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read image
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        # Run inference
        results = model(img)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Get confidence
                conf = float(box.conf[0])
                
                # Get class name
                cls = int(box.cls[0])
                class_name = result.names[cls]
                
                detections.append({
                    'bbox': [x1, y1, x2, y2],
                    'confidence': conf,
                    'class': class_name
                })
        
        return jsonify({
            'success': True,
            'detections': detections
        })

    except Exception as e:
        print(f"Error during inference: {e}")
        return jsonify({'error': str(e)}), 500

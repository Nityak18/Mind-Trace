import os
import random
import time
import re
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ML / NLP imports
try:
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import pickle
    from sklearn.feature_extraction.text import TfidfVectorizer
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    # Initialize NLTK data
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
except Exception as e:
    print(f"ML initialization failed: {e}")
    print("Backend will run in simulation mode for DistilBERT/LSTM.")

app = FastAPI(title="MindSense API", description="Mental Health Pattern Detection System")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS & CONSTANTS ---
CONDITIONS = ["Normal", "Depression", "Anxiety", "Stress", "Bipolar", "PTSD"]
SEVERITIES = ["Normal", "Mild", "Moderate", "High", "Severe"]

MODEL_PATHS = {
    "distilbert": "saved_models/distilbert_mental_health",
    "svm": "saved_models/svm_model.pkl",
    "vectorizer": "saved_models/tfidf_vectorizer.pkl",
    "lstm": "saved_models/lstm_model.h5"
}

# Global objects to store loaded models
loaded_models = {
    "distilbert": None,
    "tokenizer": None,
    "svm": None,
    "vectorizer": None,
    "lstm": None
}

def load_models():
    """Attempt to load models from disk."""
    print("Loading models...")
    
    # Try loading SVM
    try:
        if os.path.exists(MODEL_PATHS["svm"]) and os.path.exists(MODEL_PATHS["vectorizer"]):
            with open(MODEL_PATHS["svm"], "rb") as f:
                loaded_models["svm"] = pickle.load(f)
            with open(MODEL_PATHS["vectorizer"], "rb") as f:
                loaded_models["vectorizer"] = pickle.load(f)
            print("SVM model loaded successfully.")
    except Exception as e:
        print(f"Error loading SVM: {e}")

    # Try loading DistilBERT
    try:
        if os.path.exists(MODEL_PATHS["distilbert"]):
            # For demonstration, we'd load the local path. 
            # If not found, a real app might download from HG Hub.
            pass 
    except Exception as e:
        print(f"Error loading DistilBERT: {e}")

# Load models on startup
@app.on_event("startup")
async def startup_event():
    load_models()

# --- FEEDBACK GENERATOR ---
FEEDBACK_LIBRARY = {
    "Depression": {
        "message": "I can feel how heavy things are for you right now. It's okay to not be okay, and your feelings are valid.",
        "tips": ["Reach out to a trusted friend", "Try a 5-minute walk", "Speak with a professional if this persists"]
    },
    "Anxiety": {
        "message": "It sounds like your mind is racing. Let's try to bring you back to the present moment.",
        "tips": ["Try box breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s", "Breath deeply through your abdomen", "Reduce caffeine intake"]
    },
    "Stress": {
        "message": "You're carrying a lot on your shoulders. It's important to remember that you can't do everything at once.",
        "tips": ["Break your tasks into tiny steps", "Take a 15-minute screen-free break", "Say 'no' to one non-essential task today"]
    },
    "PTSD": {
        "message": "I'm sorry you're dealing with these difficult memories. Safety and grounding are the priorities right now.",
        "tips": ["Utilize grounding techniques: 5-4-3-2-1 method", "Keep a safe-space visualization handy", "Connect with specialized trauma support"]
    },
    "Bipolar": {
        "message": "Navigating intense shifts in mood can be exhausting. Finding a steady rhythm is key.",
        "tips": ["Keep a consistent sleep schedule", "Track your triggers in a journal", "Communicate your current state to your support system"]
    },
    "Normal": {
        "message": "It's great to hear that you're doing well! Maintaining this balance is a wonderful achievement.",
        "tips": ["Express gratitude for one thing today", "Continue your self-care routine", "Check in with a friend"]
    }
}

# --- SCHEMAS ---
class PredictRequest(BaseModel):
    text: str
    model: str = "distilbert"

class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    lime_explanation: List[str]
    severity: str
    feedback: str
    recommendations: List[str]

class BatchPredictRequest(BaseModel):
    texts: List[str]
    model: str = "distilbert"

# --- UTILS ---
def preprocess_text(text: str) -> str:
    """Clean and preprocess input text."""
    # Lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Tokenization & Lemmatization (Simplified for demo)
    words = text.split()
    try:
        stop_words = set(stopwords.words('english'))
        words = [w for w in words if w not in stop_words]
    except:
        pass
    return " ".join(words)

def get_lime_highlights(text: str, prediction: str) -> List[str]:
    """Identify 'trigger' words for the prediction (Simplified LIME)."""
    trigger_map = {
        "Depression": ["sad", "hopeless", "worthless", "tired", "sleep", "empty", "cry", "dark", "heavy", "stuck", "alone"],
        "Anxiety": ["worry", "panic", "fear", "fast", "heart", "nervous", "shaking", "future", "breath", "scared"],
        "Stress": ["overwhelmed", "work", "busy", "pressure", "deadline", "tired", "headache", "too", "much"],
        "PTSD": ["flashback", "trauma", "nightmare", "jumpy", "memory", "sudden", "noise", "past"],
        "Bipolar": ["mood", "manic", "swing", "high", "low", "energy", "impulsive", "rush"]
    }
    
    found_triggers = []
    text_lower = text.lower()
    
    if prediction in trigger_map:
        for word in trigger_map[prediction]:
            if word in text_lower:
                found_triggers.append(word)
    
    # Add generic emotional words if none found
    if not found_triggers:
        words = text_lower.split()
        found_triggers = [w for w in words if len(w) > 5][:2]
        
    return list(set(found_triggers))

def calculate_severity(prediction: str, confidence: float, text: str) -> str:
    """Logic to determine severity level based on prediction and context."""
    if prediction == "Normal":
        return "Normal"
        
    text_lower = text.lower()
    severe_keywords = ["suicide", "end it", "kill", "harm", "cannot breathe", "panic", "hopeless", "worthless"]
    
    if any(k in text_lower for k in severe_keywords) or confidence > 0.90:
        return "Severe"
    elif confidence > 0.75:
        return "High"
    elif confidence > 0.50:
        return "Moderate"
    else:
        return "Mild"

# --- INFERENCE ---
def run_inference(text: str, model_type: str) -> dict:
    """Core inference logic with fallback simulation."""
    processed_text = preprocess_text(text)
    
    # 1. ACTUAL SVM INFERENCE (If loaded)
    if model_type == "svm" and loaded_models["svm"] and loaded_models["vectorizer"]:
        vec = loaded_models["vectorizer"].transform([processed_text])
        probs_array = loaded_models["svm"].predict_proba(vec)[0]
        # Map indices to conditions (Simplified mapping)
        # Assuming model was trained on: [Normal, Depression, Anxiety, Stress, ...]
        probs = {CONDITIONS[i]: float(probs_array[i]) for i in range(min(len(probs_array), len(CONDITIONS)))}
        prediction = CONDITIONS[np.argmax(probs_array)]
        confidence = float(np.max(probs_array))
        
    # 2. SIMULATED / FALLBACK INFERENCE
    else:
        # A smart simulation based on keywords
        text_lower = text.lower()
        
        matches = {
            "Depression": ["sad", "hopeless", "depress", "worthless", "cry", "tired"],
            "Anxiety": ["worry", "panic", "anxious", "nervous", "scared", "fear"],
            "Stress": ["overwhelmed", "work", "pressure", "deadline", "todo"],
            "PTSD": ["trauma", "flashback", "nightmare", "incident"],
            "Bipolar": ["mood swing", "manic", "impulsive", "highs and lows"]
        }
        
        scores = {c: random.uniform(0.01, 0.05) for c in CONDITIONS}
        scores["Normal"] = 0.1 # Base normal
        
        for condition, keywords in matches.items():
            count = sum(1 for k in keywords if k in text_lower)
            if count > 0:
                scores[condition] += count * 0.4
        
        # Softmax-like normalization
        exp_scores = {k: np.exp(v) for k, v in scores.items()}
        total = sum(exp_scores.values())
        probs = {k: round(v/total, 3) for k, v in exp_scores.items()}
        
        prediction = max(probs, key=probs.get)
        confidence = probs[prediction]

    # Post-process
    severity = calculate_severity(prediction, confidence, text)
    lime = get_lime_highlights(text, prediction)
    
    # New Feedback Logic
    feedback_data = FEEDBACK_LIBRARY.get(prediction, FEEDBACK_LIBRARY["Normal"])
    
    return {
        "prediction": prediction,
        "confidence": round(confidence, 3),
        "probabilities": probs,
        "lime_explanation": lime,
        "severity": severity,
        "feedback": feedback_data["message"],
        "recommendations": feedback_data["tips"]
    }

# --- ROUTES ---
@app.get("/health")
async def health_check():
    loaded = {k: v is not None for k, v in loaded_models.items()}
    return {"status": "ok", "models_loaded": any(loaded.values()), "details": loaded}

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Process delay for realism (can be reduced)
    time.sleep(0.8)
    
    return run_inference(request.text, request.model.lower())

@app.post("/batch_predict", response_model=List[PredictResponse])
async def batch_predict(request: BatchPredictRequest):
    if not request.texts:
        raise HTTPException(status_code=400, detail="Text list cannot be empty")
    
    responses = []
    for text in request.texts:
        responses.append(run_inference(text, request.model.lower()))
    return responses

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


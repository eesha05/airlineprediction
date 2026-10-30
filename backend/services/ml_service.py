import os
import joblib
import pandas as pd
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'airline_satisfaction_model.pkl')
METRICS_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'evaluation_metrics.pkl')
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'airline_data.csv')

_model_pipeline = None
_eval_metrics = None
_dataset_cache = None

def get_model():
    global _model_pipeline
    if _model_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model artifact not found at {MODEL_PATH}")
        _model_pipeline = joblib.load(MODEL_PATH)
    return _model_pipeline

def get_metrics():
    global _eval_metrics
    if _eval_metrics is None:
        if not os.path.exists(METRICS_PATH):
            raise FileNotFoundError(f"Metrics artifact not found at {METRICS_PATH}")
        _eval_metrics = joblib.load(METRICS_PATH)
    return _eval_metrics

def get_dataset():
    global _dataset_cache
    if _dataset_cache is None:
        if not os.path.exists(DATA_PATH):
            # Fall back to root train.csv if backend/data/airline_data.csv is missing
            alt_path = os.path.join(os.path.dirname(__file__), '..', '..', 'train.csv')
            _dataset_cache = pd.read_csv(alt_path)
        else:
            _dataset_cache = pd.read_csv(DATA_PATH)
    return _dataset_cache

def predict_passenger(feature_dict: dict):
    model = get_model()
    # Normalize dictionary to match expected column names
    df = pd.DataFrame([feature_dict])
    pred = model.predict(df)[0]
    prob = model.predict_proba(df)[0]
    
    label = "satisfied" if pred == 1 else "neutral or dissatisfied"
    return {
        "prediction": label,
        "satisfied_probability": round(float(prob[1]), 3),
        "neutral_dissatisfied_probability": round(float(prob[0]), 3)
    }

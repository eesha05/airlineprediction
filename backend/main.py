from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import pandas as pd
import numpy as np

from backend.schemas.prediction import PassengerPredictionInput, PassengerPredictionOutput
from backend.services.ml_service import get_model, get_metrics, get_dataset, predict_passenger
from backend.services.analytics_service import (
    get_overview_data,
    get_demographics_data,
    get_travel_data,
    get_services_data,
    get_satisfaction_analysis_data
)

app = FastAPI(
    title="Airline Passenger Satisfaction Analytics API",
    description="FastAPI backend serving EDA analytics and Logistic Regression predictions.",
    version="1.0.0"
)

# Configure CORS for React development and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "project": "Airline Passenger Satisfaction Analysis and Prediction",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/overview")
def api_overview():
    try:
        return get_overview_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dataset/summary")
def api_dataset_summary():
    try:
        df = get_dataset()
        missing_series = df.isnull().sum()
        columns_info = []
        for col in df.columns:
            columns_info.append({
                "column": col,
                "dtype": str(df[col].dtype),
                "missing": int(missing_series[col]),
                "unique": int(df[col].nunique())
            })
        return {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "duplicates": int(df.duplicated().sum()),
            "columns": columns_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dataset")
def api_dataset(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    travel_class: Optional[str] = None,
    customer_type: Optional[str] = None,
    satisfaction: Optional[str] = None
):
    try:
        df = get_dataset()
        if travel_class:
            df = df[df['Class'] == travel_class]
        if customer_type:
            df = df[df['Customer Type'] == customer_type]
        if satisfaction:
            df = df[df['satisfaction'] == satisfaction]
        if search:
            mask = df.astype(str).apply(lambda row: row.str.contains(search, case=False).any(), axis=1)
            df = df[mask]

        total_records = len(df)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_data = df.iloc[start_idx:end_idx].fillna("N/A").to_dict(orient='records')

        return {
            "page": page,
            "page_size": page_size,
            "total_records": total_records,
            "total_pages": int(np.ceil(total_records / page_size)),
            "data": paginated_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eda/demographics")
def api_demographics(
    gender: Optional[str] = None,
    customer_type: Optional[str] = None,
    age_min: int = Query(0, ge=0),
    age_max: int = Query(100, le=120)
):
    try:
        return get_demographics_data(gender, customer_type, age_min, age_max)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eda/travel")
def api_travel(
    travel_class: Optional[str] = None,
    travel_purpose: Optional[str] = None
):
    try:
        return get_travel_data(travel_class, travel_purpose)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eda/services")
def api_services():
    try:
        return get_services_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eda/satisfaction")
def api_satisfaction():
    try:
        return get_satisfaction_analysis_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/metrics")
def api_model_metrics():
    try:
        metrics = get_metrics()
        return {
            "model_name": "Logistic Regression (L-BFGS)",
            "accuracy": round(metrics['accuracy'], 4),
            "precision": round(metrics['precision'], 4),
            "recall": round(metrics['recall'], 4),
            "f1_score": round(metrics['f1'], 4),
            "roc_auc": round(metrics['roc_auc'], 4),
            "confusion_matrix": metrics['confusion_matrix'],
            "classification_report": metrics['classification_report'],
            "roc_curve": metrics['roc_curve'],
            "training_samples": 103904,
            "test_samples": 25976,
            "decision_threshold": 0.50
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/coefficients")
def api_model_coefficients():
    try:
        metrics = get_metrics()
        coef_df = metrics['coefficients_df']
        return coef_df.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict", response_model=PassengerPredictionOutput)
def api_predict(passenger: PassengerPredictionInput):
    try:
        payload = passenger.dict(by_alias=True)
        result = predict_passenger(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

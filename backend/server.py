"""Diabetes Prediction API - FastAPI backend."""

import json
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware


# -------------------------------------------------------------------
# Environment
# -------------------------------------------------------------------

ROOT_DIR = Path(__file__).parent

load_dotenv(ROOT_DIR / ".env")


# -------------------------------------------------------------------
# MongoDB Connection
# -------------------------------------------------------------------

mongo_url = os.environ.get("MONGO_URL")

client = AsyncIOMotorClient(
    mongo_url,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=5000,
    tls=True
)

db = client[os.environ.get("DB_NAME", "glucosight")]


# -------------------------------------------------------------------
# Machine Learning Model Loading
# -------------------------------------------------------------------

ML_DIR = ROOT_DIR / "ml"

MODEL = joblib.load(
    ML_DIR / "model.pkl"
)

SCALER = joblib.load(
    ML_DIR / "scaler.pkl"
)

METRICS = json.loads(
    (ML_DIR / "metrics.json").read_text()
)


FEATURE_ORDER = [
    "glucose",
    "bloodPressure",
    "skinThickness",
    "insulin",
    "bmi",
    "diabetesPedigreeFunction",
    "age",
]


# -------------------------------------------------------------------
# FastAPI Setup
# -------------------------------------------------------------------

app = FastAPI(
    title="Diabetes Prediction API"
)

api = APIRouter(
    prefix="/api"
)


# -------------------------------------------------------------------
# Pydantic Models
# -------------------------------------------------------------------

class PredictionInput(BaseModel):

    model_config = ConfigDict(
        extra="forbid"
    )

    glucose: float = Field(
        ...,
        ge=0,
        le=300
    )

    bloodPressure: float = Field(
        ...,
        ge=0,
        le=200
    )

    skinThickness: float = Field(
        ...,
        ge=0,
        le=100
    )

    insulin: float = Field(
        ...,
        ge=0,
        le=900
    )

    bmi: float = Field(
        ...,
        ge=0,
        le=80
    )

    diabetesPedigreeFunction: float = Field(
        ...,
        ge=0,
        le=3
    )

    age: int = Field(
        ...,
        ge=1,
        le=120
    )



class PredictionRecord(BaseModel):

    model_config = ConfigDict(
        extra="ignore"
    )

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )

    inputs: dict

    prediction: str

    label: int

    confidence: float

    probability_diabetic: float

    recommendation: str

    timestamp: str = Field(
        default_factory=lambda:
        datetime.now(timezone.utc).isoformat()
    )



class ContactMessage(BaseModel):

    model_config = ConfigDict(
        extra="ignore"
    )

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )

    name: str = Field(
        ...,
        min_length=2,
        max_length=80
    )

    email: EmailStr

    subject: str = Field(
        ...,
        min_length=2,
        max_length=120
    )

    message: str = Field(
        ...,
        min_length=5,
        max_length=2000
    )

    timestamp: str = Field(
        default_factory=lambda:
        datetime.now(timezone.utc).isoformat()
    )



class ContactMessageIn(BaseModel):

    name: str

    email: EmailStr

    subject: str

    message: str



# -------------------------------------------------------------------
# Recommendation Generator
# -------------------------------------------------------------------

def build_recommendation(
    is_diabetic: bool,
    inputs: PredictionInput
) -> str:


    if is_diabetic:

        tips = [

            "Consult a certified diabetologist promptly for a personalised care plan.",

            "Limit refined sugar and simple carbs; prioritise fibre-rich vegetables, legumes and whole grains.",

            "Aim for at least 150 minutes of moderate exercise per week (walking, cycling, swimming).",

            "Monitor fasting and post-meal blood glucose regularly; keep an HbA1c log."

        ]


        if inputs.bmi >= 30:

            tips.append(
                "Work with a nutritionist on gradual weight reduction — even 5–7% helps."
            )


        if inputs.bloodPressure >= 130:

            tips.append(
                "Reduce sodium intake and track blood pressure to lower cardiovascular risk."
            )


        return " ".join(tips)



    tips = [

        "Maintain a balanced diet rich in vegetables, lean protein and whole grains.",

        "Stay physically active — 30 minutes of brisk activity, 5 days a week.",

        "Get an annual fasting glucose and HbA1c screening, especially after age 40.",

        "Manage stress and prioritise 7–8 hours of quality sleep each night."

    ]


    if inputs.bmi >= 25:

        tips.append(
            "Consider gradual weight management to stay ahead of metabolic risk."
        )


    return " ".join(tips)
# -------------------------------------------------------------------
# API Routes
# -------------------------------------------------------------------

@api.get("/")
async def root():
    return {
        "message": "Diabetes Prediction API",
        "status": "ok"
    }



# -------------------------------------------------------------------
# Prediction Endpoint (Fixed MongoDB Timeout Issue)
# -------------------------------------------------------------------

@api.post(
    "/predict",
    response_model=PredictionRecord
)
async def predict(
    payload: PredictionInput
):

    try:

        # Prepare ML input
        x = np.array(
            [
                [
                    getattr(payload, feature)
                    for feature in FEATURE_ORDER
                ]
            ],
            dtype=float
        )


        # Scale data
        x_scaled = SCALER.transform(x)


        # Prediction
        probabilities = MODEL.predict_proba(
            x_scaled
        )[0]


        label = int(
            np.argmax(probabilities)
        )


        confidence = float(
            probabilities[label]
        )


        probability_diabetic = float(
            probabilities[1]
        )


        prediction = (
            "Diabetic"
            if label == 1
            else "Non-Diabetic"
        )


        recommendation = build_recommendation(
            label == 1,
            payload
        )


        record = PredictionRecord(
            inputs=payload.model_dump(),
            prediction=prediction,
            label=label,
            confidence=confidence,
            probability_diabetic=probability_diabetic,
            recommendation=recommendation
        )


        # Save prediction to MongoDB
        # If MongoDB fails, prediction still returns
        try:

            await db.predictions.insert_one(
                record.model_dump()
            )

        except Exception as mongo_error:

            logging.error(
                f"MongoDB save failed: {mongo_error}"
            )


        return record



    except Exception as e:

        logging.exception(
            "Prediction failed"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {e}"
        )



# -------------------------------------------------------------------
# Model Metrics
# -------------------------------------------------------------------

@api.get("/model/metrics")
async def model_metrics():

    return METRICS



# -------------------------------------------------------------------
# Dashboard Statistics
# -------------------------------------------------------------------

@api.get("/dashboard/stats")
async def dashboard_stats():

    try:

        total = await db.predictions.count_documents({})

        diabetic = await db.predictions.count_documents(
            {
                "label": 1
            }
        )

        non_diabetic = await db.predictions.count_documents(
            {
                "label": 0
            }
        )


        recent_docs = (
            await db.predictions.find(
                {},
                {
                    "_id": 0
                }
            )
            .sort(
                "timestamp",
                -1
            )
            .limit(8)
            .to_list(8)
        )


        return {

            "totalPredictions": total,

            "diabeticCases": diabetic,

            "nonDiabeticCases": non_diabetic,

            "modelAccuracy": METRICS["accuracy"],

            "modelAuc": METRICS["roc_auc"],

            "featureImportance": METRICS["feature_importance"],

            "recentPredictions": recent_docs
        }


    except Exception as e:

        logging.error(
            f"Dashboard error: {e}"
        )

        return {

            "totalPredictions": 0,

            "diabeticCases": 0,

            "nonDiabeticCases": 0,

            "modelAccuracy": METRICS.get(
                "accuracy",
                0
            ),

            "modelAuc": METRICS.get(
                "roc_auc",
                0
            ),

            "featureImportance": METRICS.get(
                "feature_importance",
                {}
            ),

            "recentPredictions": []

        }



# -------------------------------------------------------------------
# Recent Predictions
# -------------------------------------------------------------------

@api.get("/predictions/recent")
async def recent_predictions(
    limit: int = 20
):

    try:

        limit = max(
            1,
            min(limit, 100)
        )


        docs = (
            await db.predictions.find(
                {},
                {
                    "_id": 0
                }
            )
            .sort(
                "timestamp",
                -1
            )
            .limit(limit)
            .to_list(limit)
        )


        return docs


    except Exception as e:

        logging.error(
            f"Recent prediction error: {e}"
        )

        return []



# -------------------------------------------------------------------
# Contact API
# -------------------------------------------------------------------

@api.post(
    "/contact",
    response_model=ContactMessage
)
async def contact(
    payload: ContactMessageIn
):

    msg = ContactMessage(
        **payload.model_dump()
    )


    try:

        await db.contact_messages.insert_one(
            msg.model_dump()
        )

    except Exception as e:

        logging.error(
            f"Contact save failed: {e}"
        )


    return msg



# -------------------------------------------------------------------
# Register Router
# -------------------------------------------------------------------

app.include_router(api)



# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_credentials=True,

    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "*"
    ).split(","),

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)



# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,

    format=
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)



# -------------------------------------------------------------------
# Shutdown
# -------------------------------------------------------------------

@app.on_event("shutdown")
async def shutdown_db_client():

    client.close()
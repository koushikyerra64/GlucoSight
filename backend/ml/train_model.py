"""
Train Random Forest Classifier for Diabetes Prediction.
Uses Pima Indians Diabetes dataset. EXCLUDES 'Pregnancies' feature.

Outputs (saved into /app/backend/ml/):
  - model.pkl          Trained RandomForestClassifier
  - scaler.pkl         StandardScaler (fitted on training features)
  - metrics.json       All performance metrics + chart-ready data
"""
import json
import os
from pathlib import Path
from urllib.request import urlopen

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

ML_DIR = Path(__file__).parent
DATA_URL = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
CSV_LOCAL = ML_DIR / "pima.csv"

FEATURES = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]
ALL_COLUMNS = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
    "Outcome",
]


def load_dataset() -> pd.DataFrame:
    """Load Pima dataset from local cache or remote URL."""
    if CSV_LOCAL.exists():
        return pd.read_csv(CSV_LOCAL, header=None, names=ALL_COLUMNS)
    try:
        raw = urlopen(DATA_URL, timeout=15).read().decode()
        CSV_LOCAL.write_text(raw)
        return pd.read_csv(CSV_LOCAL, header=None, names=ALL_COLUMNS)
    except Exception as e:
        raise RuntimeError(f"Could not download Pima dataset: {e}")


def clean(df: pd.DataFrame) -> pd.DataFrame:
    """Replace physiologically impossible zeros with column median."""
    zero_invalid = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    for col in zero_invalid:
        df[col] = df[col].replace(0, np.nan)
        df[col] = df[col].fillna(df[col].median())
    return df


def main():
    df = clean(load_dataset())
    X = df[FEATURES].values
    y = df["Outcome"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=10,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_s, y_train)

    y_pred = model.predict(X_test_s)
    y_proba = model.predict_proba(X_test_s)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()

    fpr, tpr, _ = roc_curve(y_test, y_proba)
    # downsample ROC to ~40 points for lean frontend payload
    idx = np.linspace(0, len(fpr) - 1, min(40, len(fpr))).astype(int)
    roc_points = [{"fpr": float(fpr[i]), "tpr": float(tpr[i])} for i in idx]

    importances = model.feature_importances_
    feature_importance = [
        {"feature": FEATURES[i], "importance": float(importances[i])}
        for i in np.argsort(importances)[::-1]
    ]

    metrics = {
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1_score": float(f1),
        "roc_auc": float(auc),
        "confusion_matrix": {
            "true_negative": int(cm[0][0]),
            "false_positive": int(cm[0][1]),
            "false_negative": int(cm[1][0]),
            "true_positive": int(cm[1][1]),
        },
        "roc_curve": roc_points,
        "feature_importance": feature_importance,
        "training_samples": int(len(X_train)),
        "testing_samples": int(len(X_test)),
        "total_samples": int(len(X)),
        "features": FEATURES,
    }

    joblib.dump(model, ML_DIR / "model.pkl")
    joblib.dump(scaler, ML_DIR / "scaler.pkl")
    (ML_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))

    print(f"Model trained. Accuracy={acc:.4f}  AUC={auc:.4f}")


if __name__ == "__main__":
    main()

# GlucoSight - Diabetes Prediction System

## Original Problem Statement
Build a modern, responsive Diabetes Prediction System using ML with the Random Forest algorithm.
Features form: Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age (Pregnancies excluded).
Pages: Home, About, Predict, Model Performance, Awareness, Contact, Admin Dashboard.

## Tech Stack (chosen defaults after user skipped clarification)
- **Backend**: FastAPI + Python 3, scikit-learn RandomForestClassifier, joblib, MongoDB (Motor async)
- **Frontend**: React 19 + Tailwind + Shadcn UI + Recharts + Framer Motion + Sonner
- **Dataset**: Pima Indians Diabetes (auto-downloaded/cached in `/app/backend/ml/pima.csv`)
- **Model**: 250 trees, max depth 10, StandardScaler, 80/20 stratified split

## Model Artefacts (`/app/backend/ml/`)
- `train_model.py` – training pipeline
- `model.pkl`, `scaler.pkl`, `metrics.json`
- Accuracy ≈ 0.76, AUC ≈ 0.81, F1 competitive with published Pima baselines

## Backend API (all `/api` prefix)
- `POST /api/predict` – returns prediction, confidence, probability, recommendation. Persists in `predictions` collection.
- `GET  /api/model/metrics` – full metrics + ROC + confusion matrix + feature importance
- `GET  /api/dashboard/stats` – live counts + recent predictions
- `GET  /api/predictions/recent`
- `POST /api/contact` – stores messages in `contact_messages`

## Frontend Pages
- `/` Home – hero, What is Diabetes, Symptoms, Causes, Risk Factors, Prevention, CTA
- `/about` – Overview, Objectives, Why Random Forest, Benefits, Tech Stack
- `/predict` – 7-field form with validation, live loading state, result card w/ confidence
- `/performance` – KPI tiles, ROC curve, confusion matrix, feature importance chart
- `/awareness` – Types, Symptoms, Diet, Exercise, Prevention, Early Detection
- `/contact` – Form + info cards + OpenStreetMap embed + GitHub/LinkedIn
- `/dashboard` – KPIs, feature-importance bar chart, pie chart, recent predictions table

## What's Implemented (2026-02)
- Trained model + persisted metrics.json
- Full 7-page multi-route SPA with sticky glass Navbar and dark Footer
- Live prediction & MongoDB persistence
- Sonner toasts for success/error states
- Responsive layout, framer-motion entrance animations
- data-testid across every interactive element

## Backlog / Future Work
- P1: Explainable per-prediction feature attribution (SHAP), downloadable PDF report
- P1: Auth-gated admin dashboard, role-based access
- P2: Cross-validation report page, model version selector
- P2: Multi-language (Hindi/English) toggle for wider reach
- P2: Email notifications on contact form via Resend

## Personas
- Final-year ML student demonstrating project
- Health enthusiasts screening themselves
- Educators discussing ensemble methods

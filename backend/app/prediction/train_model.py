"""
train_model.py – XGBoost regressor for EcoFleet fuel prediction.

Trains on the synthetic fleet_trips.csv, evaluates on a hold-out test split,
and saves the model + feature metadata to app/prediction/model.joblib.

Usage:
    python -m app.prediction.train_model      # from backend/
"""

from __future__ import annotations

import pathlib
import json

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor

# ── Paths ────────────────────────────────────────────────────────────
ROOT = pathlib.Path(__file__).resolve().parent.parent          # app/
DATA_PATH = ROOT / "data" / "fleet_trips.csv"
MODEL_PATH = pathlib.Path(__file__).resolve().parent / "model.joblib"

# ── Feature engineering ──────────────────────────────────────────────
CATEGORICAL = ["vehicle_type", "weather"]
NUMERIC = ["distance_km", "avg_speed_kmph", "load_kg", "traffic_index", "road_gradient"]
TARGET = "fuel_consumed_l"


def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """One-hot encode categoricals and return feature matrix."""
    df_feat = df[NUMERIC].copy()
    for col in CATEGORICAL:
        dummies = pd.get_dummies(df[col], prefix=col, drop_first=False, dtype=float)
        df_feat = pd.concat([df_feat, dummies], axis=1)
    return df_feat


def train() -> dict:
    """Train XGBRegressor, evaluate, and persist model artefact."""

    # 1. Load data
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}.  "
            "Run `python -m app.data.generate_data` first."
        )
    df = pd.read_csv(DATA_PATH)
    print(f"📦 Loaded {len(df):,} rows from {DATA_PATH.name}")

    # 2. Feature matrix + target
    X = prepare_features(df)
    y = df[TARGET]

    feature_names = list(X.columns)
    print(f"   Features ({len(feature_names)}): {feature_names}")

    # 3. Train/test split (80/20, stratified by vehicle_type bucket)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # 4. Train XGBoost
    model = XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=50,
    )

    # 5. Evaluate
    y_pred = model.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))
    print(f"\n📊 Test Results")
    print(f"   RMSE : {rmse:.4f} L")
    print(f"   R²   : {r2:.4f}  ({r2 * 100:.1f} %)")

    # 6. Feature importance (gain-based)
    importances = model.feature_importances_
    importance_dict = dict(zip(feature_names, importances.tolist()))
    sorted_imp = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)

    print(f"\n🔑 Top Feature Importances:")
    for name, imp in sorted_imp[:8]:
        print(f"   {name:25s} {imp:.4f}")

    # 7. Save artefact (model + metadata)
    artefact = {
        "model": model,
        "feature_names": feature_names,
        "feature_importance": importance_dict,
        "metrics": {"rmse": rmse, "r2": r2},
        "categorical_columns": CATEGORICAL,
        "numeric_columns": NUMERIC,
    }
    joblib.dump(artefact, MODEL_PATH)
    print(f"\n💾 Model saved → {MODEL_PATH}")

    return artefact


if __name__ == "__main__":
    train()

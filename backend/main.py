from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import pandas as pd
import pickle

from tensorflow.keras.models import load_model

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error
)

# ============================================
# FASTAPI
# ============================================

app = FastAPI()

# ============================================
# CORS
# ============================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# ============================================
# LOAD MODEL
# ============================================

model = load_model(
    "model_lstm_cabai.keras"
)

# ============================================
# LOAD SCALER
# ============================================

with open("scaler.pkl", "rb") as f:

    scaler = pickle.load(f)

# ============================================
# LOAD DATASET
# ============================================

df = pd.read_csv(
    "komoditas_cabai_rawit_2022_2026.csv"
)

# ============================================
# FILTER KALIMANTAN TENGAH
# ============================================

df = df[
    df["Province_Name"]
    == "Kalimantan Tengah"
]

# ============================================
# AMBIL KOLOM PENTING
# ============================================

df = df[[
    "Date_Param",
    "Price"
]]

# ============================================
# RENAME KOLOM
# ============================================

df.columns = [
    "Tanggal",
    "Harga"
]

# ============================================
# FORMAT TANGGAL
# ============================================

df["Tanggal"] = pd.to_datetime(
    df["Tanggal"]
)

# ============================================
# SORT TANGGAL
# ============================================

df = df.sort_values(
    "Tanggal"
)

df = df.reset_index(
    drop=True
)

# ============================================
# DATA HARGA
# ============================================

harga_data = df["Harga"].values.reshape(-1,1)

# ============================================
# SCALE DATA
# ============================================

scaled_data = scaler.transform(
    harga_data
)

# ============================================
# LOAD TEST DATA
# ============================================

with open("X_test.pkl", "rb") as f:

    X_test = pickle.load(f)

with open("y_test.pkl", "rb") as f:

    y_test = pickle.load(f)

# ============================================
# EVALUASI MODEL
# ============================================

y_pred = model.predict(
    X_test,
    verbose=0
)

# ============================================
# INVERSE TRANSFORM
# ============================================

y_pred = scaler.inverse_transform(
    y_pred
)

y_true = scaler.inverse_transform(
    y_test.reshape(-1,1)
)

# ============================================
# HITUNG METRIK
# ============================================

mae = mean_absolute_error(
    y_true,
    y_pred
)

rmse = np.sqrt(
    mean_squared_error(
        y_true,
        y_pred
    )
)

mape = np.mean(
    np.abs(
        (y_true - y_pred)
        / y_true
    )
) * 100

# ============================================
# REQUEST BODY
# ============================================

class ForecastRequest(BaseModel):

    hari_prediksi: int

# ============================================
# ROOT
# ============================================

@app.get("/")

def home():

    return {

        "message":
        "API Forecast Harga Cabai Aktif"

    }

# ============================================
# DASHBOARD DATA
# ============================================

@app.get("/dashboard-data")

def dashboard_data():

    grafik = []

    for _, row in df.iterrows():

        grafik.append({

            "tanggal":
            str(row["Tanggal"].date()),

            "harga":
            float(row["Harga"])

        })

    return {

        "jumlah_data":
        int(len(df)),

        "harga_maksimum":
        float(
            df["Harga"].max()
        ),

        "harga_minimum":
        float(
            df["Harga"].min()
        ),

        "mae":
        round(float(mae), 2),

        "rmse":
        round(float(rmse), 2),

        "mape":
        round(float(mape), 2),

        "grafik_historis":
        grafik

    }

# ============================================
# FORECAST
# ============================================

@app.post("/predict")

def predict(
    data: ForecastRequest
):

    hari_prediksi = (
        data.hari_prediksi
    )

    # ========================================
    # AMBIL 30 DATA TERAKHIR
    # ========================================

    last_sequence = (
        scaled_data[-30:]
    )

    current_seq = (
        last_sequence.reshape(
            1,
            30,
            1
        )
    )

    hasil_prediksi = []

    # ========================================
    # LOOP FORECAST
    # ========================================

    for _ in range(
        hari_prediksi
    ):

        pred = model.predict(
            current_seq,
            verbose=0
        )

        hasil_prediksi.append(
            pred[0,0]
        )

        current_seq = np.append(

            current_seq[0,1:],

            pred

        ).reshape(
            1,
            30,
            1
        )

    # ========================================
    # ARRAY PREDIKSI
    # ========================================

    hasil_prediksi = np.array(
        hasil_prediksi
    ).reshape(-1,1)

    # ========================================
    # INVERSE SCALING
    # ========================================

    hasil_rupiah = (
        scaler.inverse_transform(
            hasil_prediksi
        )
    )

    # ========================================
    # TANGGAL FORECAST
    # ========================================

    tanggal_terakhir = (
        df["Tanggal"].max()
    )

    tanggal_forecast = (
        pd.date_range(

            start=
            tanggal_terakhir
            + pd.Timedelta(days=1),

            periods=
            hari_prediksi

        )
    )

    # ========================================
    # FORECAST RESULT
    # ========================================

    forecast = []

    for tanggal, harga in zip(

        tanggal_forecast,

        hasil_rupiah.flatten()

    ):

        forecast.append({

            "tanggal":
            str(tanggal.date()),

            "prediksi_harga":
            round(
                float(harga),
                2
            )

        })

    # ========================================
    # RESPONSE
    # ========================================

    return {

        "prediksi_harga_besok":

        round(
            float(
                hasil_rupiah[0][0]
            ),
            2
        ),

        "forecast":
        forecast

    }
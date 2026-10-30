# Airline Passenger Satisfaction Analysis and Prediction
## Exploratory Data Analysis, Logistic Regression, and an Interactive React Dashboard

Built exactly to the project report specifications:
- **Project Area**: Data Analytics and Machine Learning
- **Dataset**: Airline Passenger Satisfaction (Kaggle)
- **Core Algorithm**: Logistic Regression (Scikit-learn)
- **Backend**: Python FastAPI
- **Frontend**: React.js with Recharts, Tailwind CSS, Lucide React, and React Router DOM
- **Analysis Tools**: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn

---

## 🏗️ System Architecture & Directory Structure

Conforms strictly to **Section 14 (Project Directory Structure and Implementation Plan)** of the project report:

```text
Airline-Satisfaction-Project/
│
├── airline/
│   ├── train.csv                                  # Original Kaggle training data (103,904 rows)
│   └── test.csv                                   # Original Kaggle test data (25,976 rows)
│
├── notebooks/
│   ├── airline_eda_model.ipynb                    # Comprehensive EDA & model training notebook
│   └── Airline_Passenger_Satisfaction.ipynb       # Alternative notebook copy
│
├── backend/
│   ├── main.py                                    # FastAPI application exposing all analytics & prediction endpoints
│   ├── requirements.txt                           # Backend dependencies
│   ├── model/
│   │   ├── airline_satisfaction_model.pkl         # Serialized Scikit-learn Logistic Regression Pipeline
│   │   └── evaluation_metrics.pkl                 # Precomputed test evaluation metrics & coefficients
│   ├── data/
│   │   └── airline_data.csv                       # Curated data subset for high-performance API serving
│   ├── schemas/
│   │   └── prediction.py                          # Pydantic input/output schemas with field aliases & validation
│   ├── services/
│   │   ├── ml_service.py                          # Model loading and single-passenger inference
│   │   └── analytics_service.py                   # Aggregation logic for EDA & dashboard endpoints
│   └── utils/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx                        # Persistent navy sidebar with 9 navigation routes
│   │   │   ├── Navbar.jsx                         # Top header with status indicators
│   │   │   ├── KPICard.jsx                        # Reusable metric card with icons & badges
│   │   │   └── ChartCard.jsx                      # Standardized chart card wrapper
│   │   ├── pages/
│   │   │   ├── Overview.jsx                       # KPI cards & high-level charts
│   │   │   ├── DatasetExplorer.jsx                # Paginated, searchable data table with filters
│   │   │   ├── Demographics.jsx                   # Gender, age, customer-type analysis & box stats
│   │   │   ├── TravelAnalysis.jsx                 # Travel class, flight distance, delay comparisons
│   │   │   ├── ServiceAnalysis.jsx                # 14 service touchpoint ratings & satisfaction gaps
│   │   │   ├── SatisfactionAnalysis.jsx           # Pearson correlation heatmap & normalized percentages
│   │   │   ├── ModelPerformance.jsx               # Accuracy, Precision, Recall, F1, ROC curve, coefficients
│   │   │   ├── Prediction.jsx                     # 22-feature passenger input form & probability cards
│   │   │   └── About.jsx                          # Objectives, methodology, and limitations
│   │   ├── services/
│   │   │   └── api.js                             # Axios HTTP client targeting FastAPI endpoints
│   │   ├── App.jsx                                # React Router layout & page routing
│   │   ├── main.jsx                               # Application root entry
│   │   └── index.css                              # Tailwind CSS rules & styling
│   ├── package.json                               # Frontend dependencies
│   ├── vite.config.js                             # Vite configuration with API proxy to port 8000
│   ├── tailwind.config.js                         # Tailwind custom colors & aviation theme
│   └── index.html
│
├── models/
├── utils/
├── requirements.txt
└── README.md
```

---

## 🚀 Running the Application

### 1. Start the FastAPI Backend

```bash
# From workspace root
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Root endpoint: `http://localhost:8000/`

### 2. Start the React Frontend

```bash
# In a separate terminal
cd frontend
npm run dev
```
- Dashboard runs at: `http://localhost:3000`

---

## 📡 Backend API Endpoints (Section 13)

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/overview` | GET | KPI values and overview summaries (Total, Satisfied, Dissatisfied, Rate, Accuracy) |
| `/api/dataset` | GET | Paginated, searchable dataset records with filters (`travel_class`, `customer_type`, `satisfaction`) |
| `/api/dataset/summary` | GET | Dimensions, columns, data types, duplicate count, and missingness |
| `/api/eda/demographics` | GET | Demographic aggregates and chart data |
| `/api/eda/travel` | GET | Travel and delay aggregates |
| `/api/eda/services` | GET | Service-rating aggregates and top/bottom satisfaction gaps |
| `/api/eda/satisfaction` | GET | Satisfaction comparisons and numerical correlation heatmap |
| `/api/model/metrics` | GET | Evaluation metrics, confusion matrix, and ROC curve coordinates |
| `/api/model/coefficients` | GET | Feature names and Logistic Regression coefficients |
| `/api/predict` | POST | Prediction and class probabilities for a new passenger record |

---

## 🎯 Model Performance Summary (Section 9 & 15)

Evaluated strictly on the held-out Kaggle test partition (`test.csv` - 25,976 records):

- **Accuracy**: **87.18%**
- **Precision**: **86.94%**
- **Recall**: **83.33%**
- **F1-Score**: **85.09%**
- **ROC-AUC**: **0.9256**

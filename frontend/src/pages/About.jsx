import React from 'react';
import Navbar from '../components/Navbar';
import { ExternalLink, Database, Cpu, Layout, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="About the Project"
        subtitle="Problem statement, objectives, architecture, methodology, and limitations"
      />

      <div className="p-8 max-w-4xl space-y-6 text-sm text-slate-700">
        {/* Project Report Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Problem Statement & Mission
          </h3>
          <p className="leading-relaxed">
            Airlines collect vast quantities of passenger feedback across many phases of the journey—from digital booking and boarding to seat ergonomics, catering, punctuality, and ground operations. Reviewing large datasets manually makes it difficult to uncover consistent satisfaction drivers.
          </p>
          <p className="leading-relaxed">
            This project builds an end-to-end data analytics and predictive system using historical passenger feedback to understand which factors most strongly correlate with customer satisfaction, and to evaluate real-time satisfaction probabilities for new passenger profiles using an optimized <strong>Logistic Regression</strong> classifier.
          </p>
        </div>

        {/* System Architecture */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Technology Stack & Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 text-sm block mb-1">Frontend Layer</span>
              <p className="text-slate-600 mb-2">React.js (Vite), Recharts, Tailwind CSS, Lucide React, Axios, React Router DOM.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Port 3000</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 text-sm block mb-1">Backend Layer</span>
              <p className="text-slate-600 mb-2">Python FastAPI, Uvicorn, Pydantic, Pandas, NumPy, Scikit-learn, Joblib.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Port 8000</span>
            </div>
          </div>
        </div>

        {/* Methodology & Limitations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Modeling Methodology & Limitations
          </h3>
          <ul className="space-y-2 list-disc list-inside text-xs leading-relaxed text-slate-600">
            <li><strong>Data Splitting:</strong> The model is fitted only on training data (103,904 rows) and tested strictly on the separate held-out Kaggle test partition (25,976 rows) to guarantee zero data leakage.</li>
            <li><strong>Preprocessing:</strong> ColumnTransformer combines median imputation and StandardScaler for numerical features with mode imputation and OneHotEncoder for nominal variables.</li>
            <li><strong>Associations, Not Causation:</strong> Logistic Regression coefficients quantify associations between variables and log-odds of satisfaction; they do not imply direct causal relationships.</li>
            <li><strong>Subjectivity:</strong> Passenger satisfaction is intrinsically subjective; model predictions represent probabilistic estimates rather than guarantees.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

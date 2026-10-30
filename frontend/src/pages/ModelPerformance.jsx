import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import { getModelMetrics, getModelCoefficients } from '../services/api';
import { CheckCircle2, Crosshair, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState(null);
  const [coefficients, setCoefficients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getModelMetrics(), getModelCoefficients()])
      .then(([mRes, cRes]) => {
        setMetrics(mRes);
        setCoefficients(cRes.slice(0, 15)); // top 15
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex-1">
        <Navbar title="Model Performance" subtitle="Fetching metrics..." />
        <div className="p-8 text-center text-slate-400">Loading model evaluation...</div>
      </div>
    );
  }

  // Format ROC points
  const rocPoints = metrics.roc_curve.fpr.map((fprVal, i) => ({
    fpr: fprVal,
    tpr: metrics.roc_curve.tpr[i],
  })).filter((_, idx) => idx % 20 === 0 || idx === 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Logistic Regression Model Performance"
        subtitle={`Evaluated strictly on held-out Kaggle test set (${metrics.test_samples.toLocaleString()} records)`}
      />

      <div className="p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard
            title="Accuracy"
            value={`${(metrics.accuracy * 100).toFixed(2)}%`}
            subtitle="Overall correct predictions"
            icon={CheckCircle2}
            badgeColor="bg-blue-50 text-blue-600"
          />
          <KPICard
            title="Precision"
            value={`${(metrics.precision * 100).toFixed(2)}%`}
            subtitle="Satisfied precision rate"
            icon={Crosshair}
            badgeColor="bg-emerald-50 text-emerald-600"
          />
          <KPICard
            title="Recall"
            value={`${(metrics.recall * 100).toFixed(2)}%`}
            subtitle="True positive capture"
            icon={RefreshCw}
            badgeColor="bg-amber-50 text-amber-600"
          />
          <KPICard
            title="F1-Score"
            value={`${(metrics.f1_score * 100).toFixed(2)}%`}
            subtitle="Harmonic mean balance"
            icon={BarChart2}
            badgeColor="bg-indigo-50 text-indigo-600"
          />
          <KPICard
            title="ROC-AUC"
            value={metrics.roc_auc.toFixed(4)}
            subtitle="Discriminative ranking"
            icon={ShieldAlert}
            badgeColor="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Confusion Matrix and ROC Curve */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix Heatmap Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Confusion Matrix (Test Partition)</h3>
            <p className="text-xs text-slate-500 mb-4">Actual vs Predicted satisfaction classifications</p>
            
            <div className="flex flex-col items-center justify-center p-4">
              <div className="grid grid-cols-2 gap-3 max-w-sm w-full text-center">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">True Negatives</span>
                  <p className="text-xl font-extrabold text-emerald-900 mt-1">
                    {metrics.confusion_matrix[0][0].toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-600">Correctly Neutral/Dissat</span>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">False Positives</span>
                  <p className="text-xl font-extrabold text-rose-900 mt-1">
                    {metrics.confusion_matrix[0][1].toLocaleString()}
                  </p>
                  <span className="text-[10px] text-rose-600">Type I Error</span>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">False Negatives</span>
                  <p className="text-xl font-extrabold text-rose-900 mt-1">
                    {metrics.confusion_matrix[1][0].toLocaleString()}
                  </p>
                  <span className="text-[10px] text-rose-600">Type II Error</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">True Positives</span>
                  <p className="text-xl font-extrabold text-emerald-900 mt-1">
                    {metrics.confusion_matrix[1][1].toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-600">Correctly Satisfied</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROC Curve */}
          <ChartCard
            title="Receiver Operating Characteristic (ROC) Curve"
            subtitle={`ROC-AUC: ${metrics.roc_auc} • Visualizing trade-off between TPR and FPR`}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rocPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="#64748b" fontSize={11} name="False Positive Rate" />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke="#64748b" fontSize={11} name="True Positive Rate" />
                <Tooltip />
                <Line type="monotone" dataKey="tpr" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Logistic Regression" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Feature Coefficients (Top positive and negative weights) */}
        <ChartCard
          title="Top Logistic Regression Feature Coefficients"
          subtitle="Relative impact on the log-odds of satisfaction (holding other features constant)"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={coefficients} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="Feature" type="category" width={160} stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="Coefficient" name="Weight (Coefficient)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

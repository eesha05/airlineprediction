import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { predictPassenger } from '../services/api';
import { Sparkles, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

const initialFormData = {
  Gender: "Female",
  "Customer Type": "Loyal Customer",
  Age: 35,
  "Type of Travel": "Business travel",
  Class: "Business",
  "Flight Distance": 1200,
  "Inflight wifi service": 4,
  "Departure/Arrival time convenient": 4,
  "Ease of Online booking": 4,
  "Gate location": 3,
  "Food and drink": 4,
  "Online boarding": 4,
  "Seat comfort": 5,
  "Inflight entertainment": 4,
  "On-board service": 4,
  "Leg room service": 4,
  "Baggage handling": 4,
  "Checkin service": 4,
  "Inflight service": 4,
  "Cleanliness": 4,
  "Departure Delay in Minutes": 5,
  "Arrival Delay in Minutes": 0
};

export default function Prediction() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictPassenger(formData);
      setResult(res);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please ensure all fields are valid.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Predict New Passenger Satisfaction"
        subtitle="Submit passenger profile to the trained Logistic Regression pipeline"
      />

      <div className="p-8 max-w-5xl space-y-6">
        {/* Outcome Result Card */}
        {result && (
          <div
            className={`p-6 rounded-xl border shadow-sm transition-all ${
              result.prediction === 'satisfied'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {result.prediction === 'satisfied' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                )}
                <div>
                  <h3 className="text-lg font-bold capitalize">
                    Predicted Outcome: {result.prediction}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Model estimation produced by Scikit-learn Logistic Regression pipeline.
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white/70 hover:bg-white border rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-black/10">
              <div className="bg-white/80 p-3 rounded-lg border border-black/5">
                <span className="text-xs font-semibold opacity-75">Satisfied Probability</span>
                <p className="text-xl font-black mt-0.5">
                  {(result.satisfied_probability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-black/5">
                <span className="text-xs font-semibold opacity-75">Neutral / Dissatisfied Probability</span>
                <p className="text-xl font-black mt-0.5">
                  {(result.neutral_dissatisfied_probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Section 1: Passenger Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">
              1. Passenger Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select
                  value={formData.Gender}
                  onChange={(e) => handleChange("Gender", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Customer Loyalty</label>
                <select
                  value={formData["Customer Type"]}
                  onChange={(e) => handleChange("Customer Type", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Loyal Customer">Loyal Customer</option>
                  <option value="disloyal Customer">disloyal Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.Age}
                  onChange={(e) => handleChange("Age", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Travel Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">
              2. Travel Details & Timing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Type of Travel</label>
                <select
                  value={formData["Type of Travel"]}
                  onChange={(e) => handleChange("Type of Travel", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Business travel">Business travel</option>
                  <option value="Personal Travel">Personal Travel</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cabin Class</label>
                <select
                  value={formData.Class}
                  onChange={(e) => handleChange("Class", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Business">Business</option>
                  <option value="Eco">Eco</option>
                  <option value="Eco Plus">Eco Plus</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Flight Distance (miles)</label>
                <input
                  type="number"
                  min="0"
                  value={formData["Flight Distance"]}
                  onChange={(e) => handleChange("Flight Distance", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Departure Delay (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={formData["Departure Delay in Minutes"]}
                  onChange={(e) => handleChange("Departure Delay in Minutes", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Arrival Delay (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={formData["Arrival Delay in Minutes"]}
                  onChange={(e) => handleChange("Arrival Delay in Minutes", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Digital & Booking Ratings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">
              3. Digital & Booking Services (Rating 0 to 5)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              {[
                "Inflight wifi service",
                "Departure/Arrival time convenient",
                "Ease of Online booking",
                "Gate location",
                "Online boarding"
              ].map((service) => (
                <div key={service}>
                  <label className="block text-slate-700 font-medium mb-1 truncate" title={service}>
                    {service}
                  </label>
                  <select
                    value={formData[service]}
                    onChange={(e) => handleChange(service, parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Inflight & Airport Experience */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">
              4. Inflight & Ground Experience (Rating 0 to 5)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {[
                "Seat comfort",
                "Inflight entertainment",
                "Food and drink",
                "On-board service",
                "Leg room service",
                "Baggage handling",
                "Checkin service",
                "Inflight service",
                "Cleanliness"
              ].map((service) => (
                <div key={service}>
                  <label className="block text-slate-700 font-medium mb-1 truncate" title={service}>
                    {service}
                  </label>
                  <select
                    value={formData[service]}
                    onChange={(e) => handleChange(service, parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {(service === "Baggage handling" ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5]).map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Computing Prediction..." : "Predict Satisfaction"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

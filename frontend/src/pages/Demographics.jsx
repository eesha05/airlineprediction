import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChartCard from '../components/ChartCard';
import { getDemographics } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function Demographics() {
  const [data, setData] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [ageRange, setAgeRange] = useState([0, 90]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getDemographics({
      gender: genderFilter || undefined,
      customer_type: customerFilter || undefined,
      age_min: ageRange[0],
      age_max: ageRange[1]
    })
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [genderFilter, customerFilter, ageRange]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Passenger Demographics Analysis"
        subtitle="Univariate and bivariate analysis of passenger gender, age distribution, and loyalty status"
      />

      <div className="p-8 space-y-6">
        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Customer Loyalty</label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Customer Types</option>
              <option value="Loyal Customer">Loyal Customer</option>
              <option value="disloyal Customer">disloyal Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Max Age: {ageRange[1]} yrs</label>
            <input
              type="range"
              min="20"
              max="90"
              value={ageRange[1]}
              onChange={(e) => setAgeRange([0, parseInt(e.target.value)])}
              className="w-36 accent-blue-600"
            />
          </div>
        </div>

        {loading || !data ? (
          <div className="p-12 text-center text-slate-400">Loading demographic charts...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender vs Satisfaction Grouped Bar */}
            <ChartCard
              title="Satisfaction by Gender"
              subtitle="Comparing volume of satisfied vs neutral/dissatisfied by gender"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.gender_vs_satisfaction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="gender" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="satisfied" name="Satisfied" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neutral_dissatisfied" name="Neutral/Dissatisfied" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Customer Type vs Satisfaction Normalized Bar */}
            <ChartCard
              title="Satisfaction Rate by Customer Type (%)"
              subtitle="Proportionate satisfaction breakdown across loyalty tiers"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.customer_vs_satisfaction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="customer_type" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" />
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Legend />
                  <Bar dataKey="satisfied" name="Satisfied %" fill="#10b981" stackId="a" />
                  <Bar dataKey="neutral_dissatisfied" name="Neutral/Dissatisfied %" fill="#f43f5e" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Age Distribution Histogram */}
            <ChartCard
              title="Passenger Age Histogram"
              subtitle="Filtered age group distribution"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.age_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="age_group" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" name="Passengers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Age vs Satisfaction Statistical Summary */}
            <ChartCard
              title="Age vs Satisfaction Summary (Five-Number Summary)"
              subtitle="Comparative age distribution across satisfaction targets"
            >
              <div className="w-full space-y-4 px-4 text-xs">
                {Object.entries(data.age_vs_satisfaction_box || {}).map(([key, stat]) => (
                  <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 uppercase">{key}</span>
                      <span className="text-blue-600 font-semibold">Mean: {stat.mean} yrs</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center text-[11px] text-slate-600 mt-2">
                      <div>Min: <span className="font-semibold">{stat.min}</span></div>
                      <div>Q1: <span className="font-semibold">{stat.q1}</span></div>
                      <div>Median: <span className="font-semibold">{stat.median}</span></div>
                      <div>Q3: <span className="font-semibold">{stat.q3}</span></div>
                      <div>Max: <span className="font-semibold">{stat.max}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChartCard from '../components/ChartCard';
import { getServiceAnalysis } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ServiceAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceAnalysis()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Service Ratings Analysis"
        subtitle="In-depth evaluation of 14 inflight and ground experience touchpoints"
      />

      <div className="p-8 space-y-6">
        {loading || !data ? (
          <div className="p-12 text-center text-slate-400">Loading service ratings...</div>
        ) : (
          <>
            {/* Insight Highlight Panel */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold tracking-wide uppercase text-blue-300 mb-2">
                ⭐ Key Service Insight: Largest Satisfaction Drivers
              </h3>
              <p className="text-xs text-slate-200 mb-4">
                The greatest disparity between satisfied passengers and neutral/dissatisfied passengers occurs in digital and comfort services:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {data.largest_satisfaction_gaps?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <span className="font-semibold text-white block">{item.service}</span>
                    <span className="text-emerald-400 font-bold text-sm">+{item.gap} pts gap</span>
                    <p className="text-[10px] text-slate-300 mt-0.5">Satisfied: {item.satisfied} vs Dissat: {item.neutral_dissatisfied}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Comparison Grouped Horizontal Bar */}
            <ChartCard
              title="Ratings Split by Satisfaction Group"
              subtitle="Comparison of mean scores awarded by satisfied vs dissatisfied travelers"
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.ratings_by_satisfaction} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="service" type="category" width={160} stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="satisfied" name="Satisfied Mean" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="neutral_dissatisfied" name="Dissatisfied Mean" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top and Bottom Rated Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Top Rated Services"
                subtitle="Highest average score touchpoints across all flights"
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.top_rated} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="service" type="category" width={140} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="average_rating" name="Mean Score" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Bottom Rated Services (Opportunities for Improvement)"
                subtitle="Lowest rated touchpoints requiring airline intervention"
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.bottom_rated} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="service" type="category" width={140} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="average_rating" name="Mean Score" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

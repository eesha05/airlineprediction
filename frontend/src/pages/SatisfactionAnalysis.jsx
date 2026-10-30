import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChartCard from '../components/ChartCard';
import { getSatisfactionAnalysis } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function SatisfactionAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSatisfactionAnalysis()
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
        title="Satisfaction Breakdown & Correlation Analysis"
        subtitle="Exploring cross-tabulations, relative satisfaction percentages, and numerical correlation heatmap"
      />

      <div className="p-8 space-y-6">
        {loading || !data ? (
          <div className="p-12 text-center text-slate-400">Loading satisfaction analysis...</div>
        ) : (
          <>
            {/* Normalized Satisfaction by Class Bar Chart */}
            <ChartCard
              title="Satisfaction Rate Across Travel Classes (%)"
              subtitle="Percentage distribution within each travel tier"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.satisfaction_by_class}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="class" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" />
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Legend />
                  <Bar dataKey="satisfied" name="Satisfied %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neutral_dissatisfied" name="Neutral/Dissatisfied %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Custom Grid Heatmap for Correlation */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Pearson Correlation Heatmap (Selected Numerical & Rating Features)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Displays pairwise correlation coefficients (r). Darker blues denote strong positive association.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-200 bg-slate-50 text-left font-semibold text-slate-700"></th>
                      {data.correlation_matrix.columns.map((col, idx) => (
                        <th key={idx} className="p-2 border border-slate-200 bg-slate-50 font-semibold text-slate-700 text-center min-w-[70px]">
                          {col.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.correlation_matrix.columns.map((rowCol, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-2 border border-slate-200 font-semibold text-slate-800 bg-slate-50 whitespace-nowrap">
                          {rowCol}
                        </td>
                        {data.correlation_matrix.columns.map((colCol, cIdx) => {
                          const item = data.correlation_matrix.values.find(v => v.x === colCol && v.y === rowCol);
                          const val = item ? item.value : 0;
                          
                          // Color interpolation
                          let bgColor = "bg-white";
                          let textColor = "text-slate-700";
                          if (val > 0.6) {
                            bgColor = "bg-blue-600 text-white font-bold";
                          } else if (val > 0.4) {
                            bgColor = "bg-blue-400 text-white font-semibold";
                          } else if (val > 0.2) {
                            bgColor = "bg-blue-200 text-blue-900";
                          } else if (val > 0.0) {
                            bgColor = "bg-blue-50 text-blue-800";
                          } else if (val < -0.1) {
                            bgColor = "bg-rose-100 text-rose-800";
                          }

                          return (
                            <td key={cIdx} className={`p-2 border border-slate-200 text-center text-[11px] ${bgColor}`}>
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

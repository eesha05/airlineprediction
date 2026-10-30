import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChartCard from '../components/ChartCard';
import { getTravelAnalysis } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function TravelAnalysis() {
  const [data, setData] = useState(null);
  const [travelClass, setTravelClass] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTravelAnalysis({
      travel_class: travelClass || undefined,
      travel_purpose: travelPurpose || undefined
    })
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [travelClass, travelPurpose]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Flight & Travel Analysis"
        subtitle="Exploring travel class, business vs personal travel, flight distance, and delay distributions"
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center space-x-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Cabin Class</label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Classes</option>
              <option value="Business">Business</option>
              <option value="Eco">Eco</option>
              <option value="Eco Plus">Eco Plus</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Travel Purpose</label>
            <select
              value={travelPurpose}
              onChange={(e) => setTravelPurpose(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Types</option>
              <option value="Business travel">Business travel</option>
              <option value="Personal Travel">Personal Travel</option>
            </select>
          </div>
        </div>

        {loading || !data ? (
          <div className="p-12 text-center text-slate-400">Loading travel analysis...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Satisfaction by Travel Purpose */}
            <ChartCard
              title="Satisfaction by Travel Purpose"
              subtitle="Business travel vs Personal travel sentiment outcome"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.satisfaction_by_purpose}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="type_of_travel" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="satisfied" name="Satisfied" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neutral_dissatisfied" name="Neutral/Dissatisfied" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Flight Distance Histogram */}
            <ChartCard
              title="Flight Distance Distribution"
              subtitle="Travel distance brackets (miles)"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.distance_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="distance_range" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" name="Passengers" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Average Flight Delays by Satisfaction */}
            <ChartCard
              title="Average Delay by Satisfaction Class (Minutes)"
              subtitle="Departure and Arrival disruption comparison"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.delays_by_satisfaction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="satisfaction" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(val) => `${val} min`} />
                  <Legend />
                  <Bar dataKey="avg_departure_delay" name="Avg Dep Delay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avg_arrival_delay" name="Avg Arr Delay" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Travel Purpose Breakdown Donut */}
            <ChartCard
              title="Travel Purpose Ratio"
              subtitle="Volume distribution of Business vs Personal travel"
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data.purpose_distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#38bdf8" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}

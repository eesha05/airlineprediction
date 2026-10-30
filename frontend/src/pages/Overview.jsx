import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import { getOverview } from '../services/api';
import { Users, Smile, Frown, TrendingUp, Award } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOverview()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data. Ensure backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1">
        <Navbar title="Overview Dashboard" subtitle="Loading metrics from FastAPI backend..." />
        <div className="p-8 text-center text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1">
        <Navbar title="Overview Dashboard" subtitle="Service Status" />
        <div className="p-8">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">
            {error || "No data received."}
          </div>
        </div>
      </div>
    );
  }

  const { kpis } = data;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Airline Passenger Satisfaction Overview"
        subtitle={`Dataset: ${kpis.dataset_scope} • Logistic Regression Model`}
      />

      <div className="p-8 space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <KPICard
            title="Total Passengers"
            value={kpis.total_passengers.toLocaleString()}
            subtitle="Analyzed passenger records"
            icon={Users}
            badgeColor="bg-blue-50 text-blue-600"
          />
          <KPICard
            title="Satisfied"
            value={kpis.satisfied_passengers.toLocaleString()}
            subtitle={`${((kpis.satisfied_passengers / kpis.total_passengers) * 100).toFixed(1)}% of total surveyed`}
            icon={Smile}
            badgeColor="bg-emerald-50 text-emerald-600"
          />
          <KPICard
            title="Neutral / Dissatisfied"
            value={kpis.neutral_dissatisfied_passengers.toLocaleString()}
            subtitle={`${((kpis.neutral_dissatisfied_passengers / kpis.total_passengers) * 100).toFixed(1)}% of total surveyed`}
            icon={Frown}
            badgeColor="bg-rose-50 text-rose-600"
          />
          <KPICard
            title="Satisfaction Rate"
            value={`${kpis.satisfaction_rate}%`}
            subtitle="Overall positive ratio"
            icon={TrendingUp}
            badgeColor="bg-amber-50 text-amber-600"
          />
          <KPICard
            title="Model Test Accuracy"
            value={`${kpis.model_test_accuracy}%`}
            subtitle="Logistic Regression (Test Set)"
            icon={Award}
            badgeColor="bg-indigo-50 text-indigo-600"
          />
        </div>

        {/* Primary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction Donut */}
          <ChartCard
            title="Passenger Satisfaction Distribution"
            subtitle="Overall binary classification target split"
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.satisfaction_donut}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {data.satisfaction_donut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Satisfaction by Travel Class */}
          <ChartCard
            title="Satisfaction by Travel Class"
            subtitle="Volume of satisfied vs dissatisfied passengers across cabins"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.satisfaction_by_class}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="class" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(val) => val.toLocaleString()} />
                <Legend />
                <Bar dataKey="satisfied" name="Satisfied" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neutral_dissatisfied" name="Neutral/Dissatisfied" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Secondary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Age Histogram */}
          <ChartCard
            title="Passenger Age Distribution"
            subtitle="Passenger volume grouped by age brackets"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.age_histogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" name="Passengers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Customer Type Distribution */}
          <ChartCard
            title="Customer Type Composition"
            subtitle="Loyal vs Disloyal passenger survey counts"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.customer_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" name="Passengers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Key Service Ratings */}
          <ChartCard
            title="Average Experience Ratings"
            subtitle="Mean ratings across key touchpoints (0-5 scale)"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.average_ratings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={11} />
                <YAxis dataKey="service" type="category" width={110} stroke="#64748b" fontSize={10} />
                <Tooltip />
                <Bar dataKey="rating" name="Mean Score" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

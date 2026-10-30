import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Users,
  PlaneTakeoff,
  Smile,
  PieChart,
  BrainCircuit,
  UserCheck,
  Info
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Dataset Explorer', path: '/dataset', icon: Database },
  { name: 'Demographics', path: '/demographics', icon: Users },
  { name: 'Travel Analysis', path: '/travel', icon: PlaneTakeoff },
  { name: 'Service Analysis', path: '/services', icon: Smile },
  { name: 'Satisfaction Analysis', path: '/satisfaction', icon: PieChart },
  { name: 'Model Performance', path: '/model', icon: BrainCircuit },
  { name: 'Predict Satisfaction', path: '/predict', icon: UserCheck },
  { name: 'About Project', path: '/about', icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
          ✈️
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide">AIRLINE ANALYTICS</h1>
          <p className="text-xs text-slate-400 font-medium">Satisfaction Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pipeline Info Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700/50">
          <p className="font-semibold text-slate-300 mb-1">Architecture</p>
          <p>• FastAPI Backend (8000)</p>
          <p>• React + Recharts (3000)</p>
          <p>• Logistic Regression</p>
        </div>
      </div>
    </aside>
  );
}

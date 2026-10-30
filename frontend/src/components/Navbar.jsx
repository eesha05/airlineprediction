import React from 'react';
import { Plane, Bell, Sparkles } from 'lucide-react';

export default function Navbar({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          API Connected
        </span>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-700">Logistic Regression</p>
          <p className="text-[10px] text-slate-400">Pipeline v1.0.0</p>
        </div>
      </div>
    </header>
  );
}

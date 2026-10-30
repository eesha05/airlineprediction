import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import DatasetExplorer from './pages/DatasetExplorer';
import Demographics from './pages/Demographics';
import TravelAnalysis from './pages/TravelAnalysis';
import ServiceAnalysis from './pages/ServiceAnalysis';
import SatisfactionAnalysis from './pages/SatisfactionAnalysis';
import ModelPerformance from './pages/ModelPerformance';
import Prediction from './pages/Prediction';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dataset" element={<DatasetExplorer />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/travel" element={<TravelAnalysis />} />
            <Route path="/services" element={<ServiceAnalysis />} />
            <Route path="/satisfaction" element={<SatisfactionAnalysis />} />
            <Route path="/model" element={<ModelPerformance />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

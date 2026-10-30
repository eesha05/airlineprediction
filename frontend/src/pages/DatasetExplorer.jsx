import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getDatasetSummary, getDatasetRecords } from '../services/api';
import { Search, ChevronLeft, ChevronRight, FileSpreadsheet, Filter } from 'lucide-react';

export default function DatasetExplorer() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [travelClass, setTravelClass] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDatasetSummary().then(setSummary).catch(console.error);
  }, []);

  const fetchRecords = () => {
    setLoading(true);
    getDatasetRecords({
      page,
      page_size: 10,
      search: search || undefined,
      travel_class: travelClass || undefined,
      customer_type: customerType || undefined,
      satisfaction: satisfaction || undefined,
    })
      .then(res => {
        setRecords(res.data);
        setTotalPages(res.total_pages);
        setTotalRecords(res.total_records);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [page, travelClass, customerType, satisfaction]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Navbar
        title="Dataset Explorer"
        subtitle="Search, filter, and inspect paginated raw records and schema"
      />

      <div className="p-8 space-y-6">
        {/* Dataset Schema Summary Card */}
        {summary && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Dataset Structure & Health</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">Sampled Rows</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{summary.total_rows.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">Features</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{summary.total_columns}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">Duplicate Rows</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{summary.duplicates}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">Target Classes</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">Satisfied / Neutral</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search across any field..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={travelClass}
              onChange={(e) => { setTravelClass(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700"
            >
              <option value="">All Classes</option>
              <option value="Business">Business</option>
              <option value="Eco">Eco</option>
              <option value="Eco Plus">Eco Plus</option>
            </select>

            <select
              value={customerType}
              onChange={(e) => { setCustomerType(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700"
            >
              <option value="">All Customer Types</option>
              <option value="Loyal Customer">Loyal Customer</option>
              <option value="disloyal Customer">disloyal Customer</option>
            </select>

            <select
              value={satisfaction}
              onChange={(e) => { setSatisfaction(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700"
            >
              <option value="">All Satisfaction</option>
              <option value="satisfied">Satisfied</option>
              <option value="neutral or dissatisfied">Neutral or Dissatisfied</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Travel Type</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Wi-Fi</th>
                  <th className="px-4 py-3">Comfort</th>
                  <th className="px-4 py-3">Delay (Dep/Arr)</th>
                  <th className="px-4 py-3">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                      Loading page records...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                      No records match the applied filters.
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{r['Gender']}</td>
                      <td className="px-4 py-3">{r['Customer Type']}</td>
                      <td className="px-4 py-3">{r['Age']}</td>
                      <td className="px-4 py-3">{r['Type of Travel']}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {r['Class']}
                        </span>
                      </td>
                      <td className="px-4 py-3">{r['Flight Distance']} mi</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{r['Inflight wifi service']}/5</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{r['Seat comfort']}/5</td>
                      <td className="px-4 py-3">{r['Departure Delay in Minutes']}m / {r['Arrival Delay in Minutes']}m</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r['satisfaction'] === 'satisfied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r['satisfaction']}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {records.length} of {totalRecords.toLocaleString()} filtered records
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="font-semibold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

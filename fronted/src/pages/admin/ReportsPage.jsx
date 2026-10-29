import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { getVisitsByDay, exportVisitorsCSV, exportVisitorsExcel } from '../../api/reportApi';

const downloadBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const ReportsPage = () => {
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState('');

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchVisits = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await getVisitsByDay(params);
      setVisitsData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleExport = async (type) => {
    setExporting(type);
    setError('');
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      if (type === 'csv') {
        const res = await exportVisitorsCSV(params);
        downloadBlob(res.data, 'visitors_report.csv');
      } else {
        const res = await exportVisitorsExcel(params);
        downloadBlob(res.data, 'visitors_report.xlsx');
      }
    } catch (err) {
      setError('Failed to export report');
    } finally {
      setExporting('');
    }
  };

  const maxCount = Math.max(...visitsData.map((d) => d.count), 1);

  return (
    <DashboardLayout title="Reports" subtitle="Visit trends and exportable visitor data.">

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">From</label>
          <input
            type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">To</label>
          <input
            type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={fetchVisits}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          Apply filter
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting === 'csv'}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition disabled:opacity-60"
          >
            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting === 'excel'}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition disabled:opacity-60"
          >
            {exporting === 'excel' ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <p className="text-base font-semibold text-slate-900 mb-4">Visits by day</p>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : visitsData.length === 0 ? (
          <p className="text-sm text-slate-400">No visit data for this period.</p>
        ) : (
          <div className="flex items-end gap-3 h-48 pt-4">
            {visitsData.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">{d.count}</span>
                <div
                  className="w-full bg-blue-500 rounded-t-md"
                  style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(d._id).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
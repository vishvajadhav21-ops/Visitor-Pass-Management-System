import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { getSummary } from '../../api/reportApi';
import { getAllAppointments } from '../../api/appointmentApi';
import { getAllCheckLogs } from '../../api/checklogApi';

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
      {icon}
    </div>
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

const QuickAction = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:border-blue-300 hover:shadow-md transition"
  >
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
      {icon}
    </div>
    <span className="text-sm font-semibold text-slate-800">{label}</span>
  </Link>
);

const StatusPill = ({ action }) => {
  const isIn = action === 'in';
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
      isIn ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>
      {isIn ? 'In' : 'Out'}
    </span>
  );
};

const FrontdeskDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, pendingRes, logsRes] = await Promise.all([
          getSummary(),
          getAllAppointments({ status: 'pending' }),
          getAllCheckLogs(),
        ]);
        setSummary(summaryRes.data.summary);
        setPendingCount(pendingRes.data.count);
        setRecentLogs(logsRes.data.logs.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of today's activity.">
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : error ? (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total visitors"
              value={summary?.totalVisitors ?? 0}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" /></svg>}
            />
            <StatCard
              label="Today's check-ins"
              value={summary?.todaysCheckIns ?? 0}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <StatCard
              label="Currently in building"
              value={summary?.currentlyInBuilding ?? 0}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M5 21h2m0 0h10" /></svg>}
            />
            <StatCard
              label="Pending approvals"
              value={pendingCount}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <QuickAction
              to="/frontdesk/register-visitor"
              label="Register visitor"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
            />
            <QuickAction
              to="/frontdesk/issue-pass"
              label="Issue pass"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <QuickAction
              to="/frontdesk/scan"
              label="Check-in scan"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-base font-semibold text-slate-900 mb-4">Recent check-ins</p>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-400">No check-in activity yet.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs">
                      <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
                      <th className="text-left px-4 py-2.5 font-medium">Time</th>
                      <th className="text-left px-4 py-2.5 font-medium">Location</th>
                      <th className="text-left px-4 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={log._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                            {log.visitor?.name?.slice(0, 2).toUpperCase() || '??'}
                          </div>
                          {log.visitor?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{log.location || '—'}</td>
                        <td className="px-4 py-3"><StatusPill action={log.action} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default FrontdeskDashboard;
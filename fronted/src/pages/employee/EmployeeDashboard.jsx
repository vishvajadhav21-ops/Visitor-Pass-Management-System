import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getAllAppointments } from '../../api/appointmentApi';

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
      {icon}
    </div>
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, approvedRes, allRes] = await Promise.all([
          getAllAppointments({ host: user.id, status: 'pending' }),
          getAllAppointments({ host: user.id, status: 'approved' }),
          getAllAppointments({ host: user.id }),
        ]);
        setCounts({
          pending: pendingRes.data.count,
          approved: approvedRes.data.count,
          total: allRes.data.count,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user?.name}.`}>
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Pending approvals"
              value={counts.pending}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Approved appointments"
              value={counts.approved}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            />
            <StatCard
              label="Total appointments"
              value={counts.total}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
          </div>

          <Link
            to="/employee/appointments"
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:border-blue-300 hover:shadow-md transition w-fit"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-800">View my appointments</span>
          </Link>
        </>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
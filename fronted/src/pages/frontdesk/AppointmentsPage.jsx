import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { getAllAppointments } from '../../api/appointmentApi';

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today'); // 'today' | 'upcoming'
  const navigate = useNavigate();

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const res = await getAllAppointments({ status: 'approved' });
      // sort soonest first
      const sorted = [...res.data.appointments].sort(
        (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
      );
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const filtered = appointments.filter((a) => {
    const scheduled = new Date(a.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'today') return isToday(a.scheduledDate);
    return scheduled >= today; // upcoming = today and future
  });

  return (
    <DashboardLayout title="Appointments" subtitle="Visitors approved and expected to arrive.">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              filter === 'today' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Upcoming
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400 p-5">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">
              {filter === 'today' ? 'No visitors expected today.' : 'No upcoming approved visits.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
                <th className="text-left px-4 py-2.5 font-medium">Host</th>
                <th className="text-left px-4 py-2.5 font-medium">Purpose</th>
                <th className="text-left px-4 py-2.5 font-medium">Date & time</th>
                <th className="text-right px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 flex items-center gap-2">
                    {a.visitor?.photoUrl ? (
                      <img src={a.visitor.photoUrl} alt={a.visitor.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                        {a.visitor?.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-slate-800">{a.visitor?.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{a.host?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{a.purpose}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {isToday(a.scheduledDate) && (
                      <span className="text-xs font-semibold text-blue-600 mr-2">TODAY</span>
                    )}
                    {new Date(a.scheduledDate).toLocaleDateString()}
                    {a.scheduledTimeSlot && <span className="block text-xs text-slate-400">{a.scheduledTimeSlot}</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate('/frontdesk/issue-pass')}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition"
                    >
                      Issue pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
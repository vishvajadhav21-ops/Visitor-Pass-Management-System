import { useState, useEffect } from 'react';
import { getAllAppointments } from '../../api/appointmentApi';
import AppointmentActions from './AppointmentActions';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

// extraParams lets a parent page pin a fixed filter, e.g. { host: userId }
const AppointmentList = ({ showActions = true, refreshKey, extraParams = {} }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { ...extraParams };
      if (statusFilter) params.status = statusFilter;
      const res = await getAllAppointments(params);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, refreshKey]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <span className="text-sm text-slate-500">Filter:</span>
        {['', 'pending', 'approved', 'rejected', 'cancelled'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
              statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 p-5">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-slate-400 p-5">No appointments found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs">
              <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
              <th className="text-left px-4 py-2.5 font-medium">Host</th>
              <th className="text-left px-4 py-2.5 font-medium">Purpose</th>
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              {showActions && <th className="text-right px-4 py-2.5 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-800">{a.visitor?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{a.host?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{a.purpose}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(a.scheduledDate).toLocaleDateString()}
                  {a.scheduledTimeSlot && <span className="block text-xs text-slate-400">{a.scheduledTimeSlot}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-4 py-3 text-right">
                    <AppointmentActions appointment={a} onUpdate={fetchAppointments} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
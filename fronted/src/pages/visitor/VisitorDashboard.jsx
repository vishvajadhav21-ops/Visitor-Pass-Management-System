import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getMyAppointments } from '../../api/appointmentApi';
import AppointmentRequestForm from '../../components/appointments/AppointmentRequestForm';
import { cancelAppointment } from '../../api/appointmentApi';

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-600',
};

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
];

const VisitorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [showForm, setShowForm] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMyAppointments();
            setAppointments(res.data.appointments);
            setError('');
        } catch (err) {
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancel = async (id) => {
        if (!confirm('Cancel this appointment request?')) return;
        try {
            await cancelAppointment(id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel');
        }
    };


    const filtered = activeTab === 'all'
        ? appointments
        : appointments.filter((a) => a.status === activeTab);

    return (
        <DashboardLayout title="My visits" subtitle={`Welcome, ${user?.name}.`}>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                >
                    {showForm ? 'Cancel' : '+ Request appointment'}
                </button>
            </div>

            {showForm && (
                <div className="mb-6">
                    <AppointmentRequestForm
                        onSuccess={() => { setShowForm(false); fetchData(); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-2">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-sm text-slate-400 p-5">Loading...</p>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-slate-500 mb-1">No appointments here yet.</p>
                        <p className="text-xs text-slate-400">Click "Request appointment" above to book your first visit.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs">
                                <th className="text-left px-4 py-2.5 font-medium">Host</th>
                                <th className="text-left px-4 py-2.5 font-medium">Purpose</th>
                                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                                <th className="text-right px-4 py-2.5 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a._id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 text-slate-800">{a.host?.name || '—'}</td>
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
                                    <td className="px-4 py-3 text-right">
                                        {(a.status === 'pending' || a.status === 'approved') && (
                                            <button
                                                onClick={() => handleCancel(a._id)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        )}
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

export default VisitorDashboard;
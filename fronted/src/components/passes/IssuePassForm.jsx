import { useState, useEffect } from 'react';
import { issuePass } from '../../api/passApi';
import { getAllVisitors } from '../../api/visitorApi';
import { getAllAppointments } from '../../api/appointmentApi';

const toDatetimeLocal = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const IssuePassForm = ({ onSuccess }) => {
  const [visitors, setVisitors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const laterToday = new Date(now.getTime() + 8 * 60 * 60 * 1000); // default: 8 hours from now

  const [formData, setFormData] = useState({
    visitorId: '',
    appointmentId: '',
    validFrom: toDatetimeLocal(now),
    validTo: toDatetimeLocal(laterToday),
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [visitorsRes, appointmentsRes] = await Promise.all([
          getAllVisitors(),
          getAllAppointments({ status: 'approved' }),
        ]);
        setVisitors(visitorsRes.data.visitors);
        setAppointments(appointmentsRes.data.appointments);
      } catch (err) {
        setError('Failed to load visitors or appointments');
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.visitorId) {
      setError('Please select a visitor');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        visitorId: formData.visitorId,
        appointmentId: formData.appointmentId || null,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
      };
      const res = await issuePass(payload);
      onSuccess?.(res.data.pass);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue pass');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Visitor *</label>
          <select
            name="visitorId" value={formData.visitorId} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select visitor</option>
            {visitors.map((v) => (
              <option key={v._id} value={v._id}>{v.name} — {v.phone}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Link to appointment (optional)</label>
          <select
            name="appointmentId" value={formData.appointmentId} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">No appointment (walk-in)</option>
            {appointments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.visitor?.name} — {a.purpose} ({new Date(a.scheduledDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Valid from *</label>
          <input
            type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Valid to *</label>
          <input
            type="datetime-local" name="validTo" value={formData.validTo} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        type="submit" disabled={submitting}
        className="mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
      >
        {submitting ? 'Issuing...' : 'Issue pass'}
      </button>
    </form>
  );
};

export default IssuePassForm;
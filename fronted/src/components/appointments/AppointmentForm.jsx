import { useState, useEffect } from 'react';
import { requestAppointment } from '../../api/appointmentApi';
import { getHostsList } from '../../api/userApi';

const AppointmentRequestForm = ({ onSuccess, onCancel }) => {
  const [hosts, setHosts] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    host: '',
    purpose: '',
    scheduledDate: '',
    scheduledTimeSlot: '',
    notes: '',
    phone: '',
  });

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await getHostsList();
        setHosts(res.data.hosts);
      } catch (err) {
        setError('Failed to load host list');
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.host || !formData.purpose || !formData.scheduledDate) {
      setError('Please select a host, purpose, and date');
      return;
    }

    setSubmitting(true);
    try {
      await requestAppointment(formData);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
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
          <label className="block text-sm text-slate-600 mb-1.5">Who are you visiting? *</label>
          <select
            name="host" value={formData.host} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select host</option>
            {hosts.map((h) => (
              <option key={h._id} value={h._id}>{h.name} — {h.department || 'No dept'}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Your phone number *</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="Required for your visitor record"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Purpose *</label>
          <input
            type="text" name="purpose" value={formData.purpose} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Preferred date *</label>
          <input
            type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Preferred time slot</label>
          <input
            type="text" name="scheduledTimeSlot" value={formData.scheduledTimeSlot} onChange={handleChange}
            placeholder="10:00 AM - 11:00 AM"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Notes</label>
          <input
            type="text" name="notes" value={formData.notes} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit" disabled={submitting}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit request'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentRequestForm;
import { useState } from 'react';
import { registerVisitor } from '../../api/visitorApi';

const VisitorForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    idProofType: '',
    idProofNumber: '',
    purposeOfVisit: '',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone) {
      setError('Name and phone are required');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append('photo', photo);

      const res = await registerVisitor(data);

      setFormData({
        name: '', phone: '', email: '', company: '',
        idProofType: '', idProofNumber: '', purposeOfVisit: '',
      });
      setPhoto(null);
      setPreview(null);

      onSuccess?.(res.data.visitor);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register visitor');
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
        <div className="col-span-2 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div>
            <label className="inline-block px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition">
              Upload photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Full name *</label>
          <input
            type="text" name="name" value={formData.name} onChange={handleChange} required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Phone *</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange} required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Email</label>
          <input
            type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Company</label>
          <input
            type="text" name="company" value={formData.company} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">ID proof type</label>
          <input
            type="text" name="idProofType" value={formData.idProofType} onChange={handleChange}
            placeholder="Aadhar, Passport, etc."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">ID proof number</label>
          <input
            type="text" name="idProofNumber" value={formData.idProofNumber} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-slate-600 mb-1.5">Purpose of visit</label>
          <input
            type="text" name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        type="submit" disabled={submitting}
        className="mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
      >
        {submitting ? 'Registering...' : 'Register visitor'}
      </button>
    </form>
  );
};

export default VisitorForm;
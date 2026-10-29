import { useState, useEffect } from 'react';
import { getAllPasses, revokePass } from '../../api/passApi';
import DashboardLayout from '../../components/common/DashboardLayout';

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  used: 'bg-slate-100 text-slate-600',
  expired: 'bg-red-100 text-red-700',
  revoked: 'bg-red-100 text-red-700',
};

const PassesPage = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await getAllPasses(params);
      setPasses(res.data.passes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleRevoke = async (id) => {
    if (!confirm('Revoke this pass? The visitor will no longer be able to check in with it.')) return;
    try {
      await revokePass(id);
      fetchPasses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke pass');
    }
  };

  return (
    <DashboardLayout title="Passes" subtitle="All issued visitor passes.">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <span className="text-sm text-slate-500">Filter:</span>
          {['', 'active', 'used', 'expired', 'revoked'].map((s) => (
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
        ) : passes.length === 0 ? (
          <p className="text-sm text-slate-400 p-5">No passes found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
                <th className="text-left px-4 py-2.5 font-medium">Valid from</th>
                <th className="text-left px-4 py-2.5 font-medium">Valid to</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">QR / PDF</th>
                <th className="text-right px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 flex items-center gap-2">
                    {p.visitor?.photoUrl ? (
                      <img src={p.visitor.photoUrl} alt={p.visitor.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                        {p.visitor?.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-slate-800">{p.visitor?.name || 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(p.validFrom).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(p.validTo).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <a href={p.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">QR</a>
                      {p.pdfUrl && (
                        <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">PDF</a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === 'active' && (
                      <button
                        onClick={() => handleRevoke(p._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Revoke
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

export default PassesPage;
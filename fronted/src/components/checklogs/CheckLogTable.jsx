const CheckLogTable = ({ logs, loading }) => {
  if (loading) return <p className="text-sm text-slate-400 p-5">Loading...</p>;
  if (logs.length === 0) return <p className="text-sm text-slate-400 p-5">No check-in activity yet.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 text-slate-500 text-xs">
          <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
          <th className="text-left px-4 py-2.5 font-medium">Time</th>
          <th className="text-left px-4 py-2.5 font-medium">Location</th>
          <th className="text-left px-4 py-2.5 font-medium">Scanned by</th>
          <th className="text-left px-4 py-2.5 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id} className="border-t border-slate-100">
            <td className="px-4 py-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                {log.visitor?.name?.slice(0, 2).toUpperCase() || '??'}
              </div>
              <span className="text-slate-800">{log.visitor?.name || 'Unknown'}</span>
            </td>
            <td className="px-4 py-3 text-slate-500">
              {new Date(log.timestamp).toLocaleString()}
            </td>
            <td className="px-4 py-3 text-slate-500">{log.location || '—'}</td>
            <td className="px-4 py-3 text-slate-500">{log.scannedBy?.name || '—'}</td>
            <td className="px-4 py-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                log.action === 'in' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {log.action === 'in' ? 'In' : 'Out'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CheckLogTable;
const VisitorTable = ({ visitors, loading }) => {
  if (loading) return <p className="text-sm text-slate-400 p-5">Loading...</p>;
  if (visitors.length === 0) return <p className="text-sm text-slate-400 p-5">No visitors found.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 text-slate-500 text-xs">
          <th className="text-left px-4 py-2.5 font-medium">Visitor</th>
          <th className="text-left px-4 py-2.5 font-medium">Phone</th>
          <th className="text-left px-4 py-2.5 font-medium">Company</th>
          <th className="text-left px-4 py-2.5 font-medium">Purpose</th>
          <th className="text-left px-4 py-2.5 font-medium">Registered</th>
        </tr>
      </thead>
      <tbody>
        {visitors.map((v) => (
          <tr key={v._id} className="border-t border-slate-100">
            <td className="px-4 py-3 flex items-center gap-2">
              {v.photoUrl ? (
                <img src={v.photoUrl} alt={v.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                  {v.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-slate-800">{v.name}</span>
            </td>
            <td className="px-4 py-3 text-slate-500">{v.phone}</td>
            <td className="px-4 py-3 text-slate-500">{v.company || '—'}</td>
            <td className="px-4 py-3 text-slate-500">{v.purposeOfVisit || '—'}</td>
            <td className="px-4 py-3 text-slate-500">
              {new Date(v.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VisitorTable;
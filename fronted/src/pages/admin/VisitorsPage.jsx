import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import VisitorTable from '../../components/visitors/VisitorTable';
import { getAllVisitors } from '../../api/visitorApi';

const VisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVisitors = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await getAllVisitors(searchTerm ? { search: searchTerm } : {});
      setVisitors(res.data.visitors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisitors(search);
  };

  return (
    <DashboardLayout title="Visitors" subtitle="All registered visitors in the system.">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              Search
            </button>
          </form>
        </div>
        <VisitorTable visitors={visitors} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default VisitorsPage;
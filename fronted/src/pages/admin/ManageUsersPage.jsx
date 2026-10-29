import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { getAllUsers, createUser, deleteUser } from '../../api/userApi';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'frontdesk',
    department: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createUser(formData);
      setFormData({ name: '', email: '', password: '', role: 'frontdesk', department: '' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff account?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleBadgeColor = (role) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700';
    if (role === 'frontdesk') return 'bg-blue-100 text-blue-700';
    if (role === 'employee') return 'bg-teal-100 text-teal-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <DashboardLayout title="Staff" subtitle="Manage frontdesk, employee, and admin accounts.">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          {showForm ? 'Cancel' : '+ Add staff member'}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Full name</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Email</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Password</label>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange} required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Role</label>
            <select
              name="role" value={formData.role} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="frontdesk">Frontdesk</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-slate-600 mb-1.5">Department (optional)</label>
            <input
              type="text" name="department" value={formData.department} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit" disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-slate-400 p-5">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400 p-5">No staff accounts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Name</th>
                <th className="text-left px-4 py-2.5 font-medium">Email</th>
                <th className="text-left px-4 py-2.5 font-medium">Role</th>
                <th className="text-left px-4 py-2.5 font-medium">Department</th>
                <th className="text-right px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleBadgeColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.department || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
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

export default ManageUsersPage;
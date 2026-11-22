import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const LEVEL_LABEL = {
  class10: 'Class 10',
  class12: 'Class 12',
  college: 'College',
  graduate: 'Graduate',
};

const selectClass = 'border border-gray-300 rounded-lg p-2 text-sm bg-white';
const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—');

function AdminUsers() {
  const me = JSON.parse(localStorage.getItem('user') || '{}');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [verified, setVerified] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const requestId = useRef(0);
  const firstRun = useRef(true);
  const filtersKey = `${search}|${role}|${verified}|${level}`;
  const lastFilters = useRef(filtersKey);

  useEffect(() => {
    // A filter change goes back to page 1 and waits briefly while typing.
    const filtersChanged = lastFilters.current !== filtersKey;
    lastFilters.current = filtersKey;
    if (filtersChanged && page !== 1) {
      setPage(1);
      return;
    }

    const delay = firstRun.current || !filtersChanged ? 0 : 400;
    firstRun.current = false;

    const timer = setTimeout(async () => {
      const mine = ++requestId.current;
      setRefreshing(true);
      setError('');
      try {
        const params = { page };
        if (search.trim()) params.search = search.trim();
        if (role) params.role = role;
        if (verified) params.verified = verified;
        if (level) params.level = level;
        const res = await axiosInstance.get('/admin/users', { params });
        if (mine !== requestId.current) return;
        setUsers(res.data.users);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        if (mine !== requestId.current) return;
        setError(err.response?.data?.message || 'Could not load users.');
      } finally {
        if (mine === requestId.current) {
          setRefreshing(false);
          setLoading(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [filtersKey, page, reloadKey]);

  const hasFilters = search || role || verified || level;
  const clearFilters = () => {
    setSearch('');
    setRole('');
    setVerified('');
    setLevel('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Users</h1>
      <p className="text-gray-600 mb-6">
        View only. Account basics, with no passwords or private student content.
      </p>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <input
          className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>
          <select value={verified} onChange={(e) => setVerified(e.target.value)} className={selectClass}>
            <option value="">Any email status</option>
            <option value="true">Verified</option>
            <option value="false">Not verified</option>
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
            <option value="">All levels</option>
            <option value="class10">Class 10</option>
            <option value="class12">Class 12</option>
            <option value="college">College</option>
            <option value="graduate">Graduate</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">
              Clear filters
            </button>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {loading ? 'Loading...' : `${total} user${total === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading users...</p>}

      {!loading && error && (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-500">No users match these filters.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className={`bg-white rounded-xl shadow-sm overflow-x-auto ${refreshing ? 'opacity-60' : ''}`}>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Level</th>
                <th className="p-3">Role</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="p-3 font-medium whitespace-nowrap">
                    {u.name}
                    {u._id === me.id || u._id === me._id ? (
                      <span className="ml-2 text-xs text-indigo-600">(you)</span>
                    ) : null}
                  </td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">{LEVEL_LABEL[u.educationLevel] || '—'}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u.isVerified ? '✅' : '—'}</td>
                  <td className="p-3">{u.currentStreak ? `🔥 ${u.currentStreak}` : '—'}</td>
                  <td className="p-3 text-gray-500 whitespace-nowrap">{fmt(u.createdAt)}</td>
                  <td className="p-3 text-gray-500 whitespace-nowrap">{fmt(u.lastActiveDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            className="bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
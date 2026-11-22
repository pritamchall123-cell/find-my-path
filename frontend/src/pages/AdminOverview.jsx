import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const LEVEL_LABEL = {
  class10: 'Class 10',
  class12: 'Class 12',
  college: 'College',
  graduate: 'Graduate',
  'not set': 'Not set',
};

const show = (n) => (n === null || n === undefined ? '—' : n);

function StatCard({ label, value, hint, warn }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${warn ? 'text-amber-600' : 'text-gray-900'}`}>
        {show(value)}
      </p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">{title}</h2>
      {children}
    </section>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-gray-500">Loading overview...</p>;

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={load}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    );
  }

  const { users, content, usage, dataQuality, signupsByDay, recentUsers } = stats;
  const maxSignups = Math.max(1, ...signupsByDay.map((d) => d.count));
  const verifiedPct = users.total ? Math.round((users.verified / users.total) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Overview</h1>
      <p className="text-gray-600 mb-6">How the site is doing right now.</p>

      <Section title="Users">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Total users" value={users.total} />
          <StatCard label="New (7 days)" value={users.last7Days} />
          <StatCard label="New (30 days)" value={users.last30Days} />
          <StatCard label="Verified emails" value={users.verified} hint={`${verifiedPct}% of users`} />
          <StatCard label="Admins" value={users.admins} />
        </div>
      </Section>

      <Section title="Signups, last 30 days">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-end gap-1 h-32">
            {signupsByDay.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} signup(s)`}
                className="flex-1 bg-indigo-500 rounded-t"
                style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / maxSignups) * 100)}%`, opacity: d.count ? 1 : 0.2 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{signupsByDay[0]?.date}</span>
            <span>{signupsByDay[signupsByDay.length - 1]?.date}</span>
          </div>
        </div>
      </Section>

      {users.byEducationLevel.length > 0 && (
        <Section title="Users by education level">
          <div className="flex flex-wrap gap-2">
            {users.byEducationLevel.map((e) => (
              <span key={e.level} className="bg-white shadow-sm rounded-full px-3 py-1 text-sm">
                {LEVEL_LABEL[e.level] || e.level}: <strong>{e.count}</strong>
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Content">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Careers" value={content.careers} />
          <StatCard label="Colleges" value={content.colleges} />
          <StatCard label="Scholarships" value={content.scholarships} />
          <StatCard label="Guide sections" value={content.guides} />
        </div>
      </Section>

      <Section title="Usage">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Assessments taken" value={usage.assessments} />
          <StatCard label="Roadmaps" value={usage.roadmaps} />
          <StatCard label="Resumes analyzed" value={usage.resumes} />
          <StatCard label="Portfolio entries" value={usage.portfolios} />
          <StatCard label="Career goals" value={usage.goals} />
        </div>
      </Section>

      <Section title="Data quality">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Colleges unverified" value={dataQuality.collegesUnverified} warn={dataQuality.collegesUnverified > 0} />
          <StatCard label="Colleges without image" value={dataQuality.collegesNoImage} warn={dataQuality.collegesNoImage > 0} />
          <StatCard label="Colleges without map location" value={dataQuality.collegesNoCoords} warn={dataQuality.collegesNoCoords > 0} />
          <StatCard label="Scholarships unverified" value={dataQuality.scholarshipsUnverified} warn={dataQuality.scholarshipsUnverified > 0} />
        </div>
      </Section>

      <Section title="Recent signups">
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Level</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">{LEVEL_LABEL[u.educationLevel] || '—'}</td>
                  <td className="p-3">{u.isVerified ? '✅' : '—'}</td>
                  <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

export default AdminOverview;
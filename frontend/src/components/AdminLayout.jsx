import { NavLink, Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const links = [
  { to: '/admin', label: 'Overview', icon: '📊', end: true },
  { to: '/admin/colleges', label: 'Colleges', icon: '🏫' },
  { to: '/admin/careers', label: 'Careers', icon: '💼' },
];

function AdminLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role !== 'admin') {
    return <p className="p-8 text-red-600">This area is for admins only.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <h2 className="hidden md:block text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
            Admin
          </h2>
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-white'
                  }`
                }
              >
                <span>{l.icon}</span>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
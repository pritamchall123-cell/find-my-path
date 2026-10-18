import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SideMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setOpen(false);
  };

  const close = () => setOpen(false);

  const navGroups = [
    {
      label: 'My Journey',
      links: [
        { to: '/profile', icon: '👤', label: 'My Profile' },
        { to: '/dashboard', icon: '📊', label: 'Dashboard' },
        { to: '/roadmap', icon: '🗺️', label: 'My Roadmap' },
        { to: '/readiness', icon: '📈', label: 'Career Readiness' },
        { to: '/saved-careers', icon: '🔖', label: 'Saved Careers' },
      ],
    },
    {
      label: 'Tools',
      links: [
        { to: '/resume', icon: '📄', label: 'Resume Analyzer' },
        { to: '/degree-paths', icon: '🏛️', label: 'Degree Paths' },
        { to: '/qualification-guide', icon: '📋', label: 'What Can I Do Now?' },
        { to: '/institutions', icon: '🏫', label: 'Find Colleges' },
        { to: '/scholarships', icon: '💰', label: 'Scholarships' },
        { to: '/assistant', icon: '💬', label: 'Ask AI' },
      ],
    },
  ];

  if (user.role === 'admin') {
    navGroups.push({
      label: 'Admin',
      links: [{ to: '/admin', icon: '🛠️', label: 'Admin Panel' }],
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1 p-2 justify-center items-center group"
        aria-label="Open menu"
      >
        <span className="block w-6 h-0.5 bg-gray-700 rounded-full transition-all group-hover:bg-blue-600"></span>
        <span className="block w-6 h-0.5 bg-gray-700 rounded-full transition-all group-hover:bg-blue-600"></span>
        <span className="block w-6 h-0.5 bg-gray-700 rounded-full transition-all group-hover:bg-blue-600"></span>
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 relative">
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none transition-transform hover:rotate-90 duration-200"
            aria-label="Close menu"
          >
            ×
          </button>
          <div className="w-14 h-14 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-xl mb-3 shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <p className="font-bold text-lg">{user.name || 'Guest'}</p>
          <p className="text-sm text-blue-100">{user.email}</p>
          {user.educationLevel && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full inline-block mt-2">
              {user.educationLevel}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navGroups.map((group, gi) => (
            <div key={gi} className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1.5">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.links.map((link, li) => (
                  <Link
                    key={li}
                    to={link.to}
                    onClick={close}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-blue-50 hover:translate-x-1 transition-all text-sm font-medium text-gray-700"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4 flex flex-col gap-0.5">
          <Link
            to="/settings"
            onClick={close}
            className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-blue-50 hover:translate-x-1 transition-all text-sm font-medium text-gray-700"
          >
            <span className="text-lg">⚙️</span>
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-red-50 hover:translate-x-1 transition-all text-sm font-medium text-red-600 text-left"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
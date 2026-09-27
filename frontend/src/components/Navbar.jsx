import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        FindMyPath
      </Link>

      <div className="flex gap-4 items-center text-sm font-medium flex-wrap">
        <Link to="/careers" className="text-gray-700 hover:text-blue-600">
          Careers
        </Link>

        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <Link to="/assessment" className="text-gray-700 hover:text-blue-600">
              Assessment
            </Link>
            <Link to="/roadmap" className="text-gray-700 hover:text-blue-600">
              Roadmap
            </Link>
            <Link to="/readiness" className="text-gray-700 hover:text-blue-600">
              Readiness
            </Link>
            <Link to="/resume" className="text-gray-700 hover:text-blue-600">
              Resume
            </Link>
            <Link to="/assistant" className="text-gray-700 hover:text-blue-600">
              Ask AI
            </Link>
            <NotificationBell />
            <span className="text-gray-500">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';
import SideMenu from './SideMenu';
import LanguageToggle from './LanguageToggle';

function Navbar() {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        FindMyPath
      </Link>

      <div className="flex gap-4 items-center text-sm font-medium">
        <Link to="/careers" className="text-gray-700 hover:text-blue-600 hidden sm:block">
          {t('nav.careers')}
        </Link>
        <Link to="/degree-paths" className="text-gray-700 hover:text-blue-600 hidden sm:block">
          {t('nav.degreePaths')}
        </Link>
        <Link to="/institutions" className="text-gray-700 hover:text-blue-600 hidden sm:block">
          Find Colleges
        </Link>
        <Link to="/scholarships" className="text-gray-700 hover:text-blue-600 hidden sm:block">
          Scholarships
        </Link>
        <Link to="/qualification-guide" className="text-gray-700 hover:text-blue-600 hidden sm:block">
          What Can I Do?
        </Link>
        <LanguageToggle />

        {token ? (
          <>
            <NotificationBell />
            <SideMenu />
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              {t('nav.signup')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
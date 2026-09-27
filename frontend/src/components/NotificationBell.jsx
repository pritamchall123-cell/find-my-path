import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      // silently ignore — notifications aren't critical
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = async () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      try {
        await axiosInstance.patch('/notifications/read-all');
        fetchNotifications();
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative text-gray-700 hover:text-blue-600">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-10 max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 p-4">No notifications yet.</p>
          )}
          {notifications.map((n) => (
            <div key={n._id} className="p-3 border-b text-sm text-gray-700 last:border-b-0">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
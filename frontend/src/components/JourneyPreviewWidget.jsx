import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const typeIcons = {
  education: '🎓',
  project: '🛠️',
  roadmap: '🗺️',
  assessment: '📝',
  achievement: '🏅',
};

const formatDate = (event) => {
  const d = new Date(event.date);
  if (event.dateIsApproximate) {
    return `Around ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function JourneyPreviewWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/timeline')
      .then((res) => setEvents(res.data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  // The timeline is sorted oldest-first, so the newest events are at the end.
  const recent = events.slice(-3).reverse();

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">🧭 My Journey</h2>
        <Link to="/journey" className="text-sm text-blue-600 font-medium hover:underline">
          View full journey →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nothing recorded yet. Add your{' '}
          <Link to="/education-history" className="text-blue-600 hover:underline">
            education
          </Link>{' '}
          or a{' '}
          <Link to="/portfolio" className="text-blue-600 hover:underline">
            project
          </Link>{' '}
          and your journey will start to build here.
        </p>
      ) : (
        <ul className="space-y-3">
          {recent.map((event) => (
            <li key={event.id} className="flex gap-3 items-start">
              <span className="text-lg">{typeIcons[event.type] || '📌'}</span>
              <div>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-gray-500">{formatDate(event)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JourneyPreviewWidget;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const typeConfig = {
  education: { label: 'Education', icon: '🎓', color: 'bg-indigo-500' },
  project: { label: 'Projects', icon: '🛠️', color: 'bg-green-500' },
  roadmap: { label: 'Roadmap', icon: '🗺️', color: 'bg-amber-500' },
  assessment: { label: 'Assessments', icon: '📝', color: 'bg-fuchsia-500' },
  achievement: { label: 'Achievements', icon: '🏅', color: 'bg-rose-500' },
};

const formatDate = (event) => {
  const d = new Date(event.date);
  if (event.dateIsApproximate) {
    return `Around ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function JourneyTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axiosInstance
      .get('/timeline')
      .then((res) => setEvents(res.data.events))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Building your journey..." />;

  const visible = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
        <h1 className="text-3xl font-bold">My Journey</h1>
        <Link
          to="/achievements"
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
        >
          + Add Achievement
        </Link>
      </div>
      <p className="text-gray-600 mb-6">
        A timeline built from what you have actually recorded. Nothing here is invented. Entries
        marked "Added by you" are milestones you wrote yourself; the rest are picked up
        automatically from your education, projects, and progress.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          All ({events.length})
        </button>
        {Object.entries(typeConfig).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {cfg.icon} {cfg.label}
          </button>
        ))}
      </div>

      {events.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">
            Your journey is empty so far. It fills in as you add to your profile:
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link to="/education-history" className="text-blue-600 font-medium hover:underline">
              Add education →
            </Link>
            <Link to="/portfolio" className="text-blue-600 font-medium hover:underline">
              Add a project →
            </Link>
            <Link to="/achievements" className="text-blue-600 font-medium hover:underline">
              Add an achievement →
            </Link>
            <Link to="/assessment" className="text-blue-600 font-medium hover:underline">
              Take the assessment →
            </Link>
          </div>
        </div>
      )}

      {events.length > 0 && visible.length === 0 && (
        <p className="text-gray-500">No events of this type yet.</p>
      )}

      {visible.length > 0 && (
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200"></div>

          {visible.map((event) => {
            const cfg = typeConfig[event.type];
            return (
              <div key={event.id} className="relative mb-5 last:mb-0">
                <div
                  className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-50 ${cfg.color}`}
                >
                  {cfg.icon}
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{event.title}</p>
                    {event.origin === 'user' && (
                      <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                        Added by you
                      </span>
                    )}
                  </div>
                  {event.detail && <p className="text-sm text-gray-600 mt-1">{event.detail}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(event)}
                    {event.dateIsApproximate && (
                      <span className="text-gray-400"> · approximate</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default JourneyTimeline;
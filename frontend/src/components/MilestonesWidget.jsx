import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function MilestonesWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/milestones')
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-2xl font-extrabold text-orange-500">
              {data.currentStreak} {data.currentStreak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-gray-500">
              Current streak · Longest: {data.longestStreak} days
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {data.achievedCount}/{data.totalCount} milestones unlocked
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.milestones.map((m) => (
          <div
            key={m.key}
            className={`p-3 rounded-lg border text-center transition-all ${
              m.achieved
                ? 'bg-amber-50 border-amber-200'
                : 'bg-gray-50 border-gray-200 opacity-50'
            }`}
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <p className="text-xs font-medium text-gray-700 leading-tight">{m.title}</p>
            {m.progress && !m.achieved && (
              <p className="text-[10px] text-gray-400 mt-1">{m.progress}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MilestonesWidget;
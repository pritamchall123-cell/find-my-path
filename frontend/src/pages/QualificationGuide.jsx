import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const levelLabels = {
  class10: 'After Class 10',
  class12: 'After Class 12',
  diploma: 'After Diploma / Polytechnic',
  masters: "After Master's / MBA / MCA / M.Sc",
};

function QualificationGuide() {
  const [activeLevel, setActiveLevel] = useState('class10');
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/guides/${activeLevel}`);
        setSection(res.data.section);
      } catch (err) {
        setSection(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [activeLevel]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">What Can I Do Right Now?</h1>
      <p className="text-gray-600 mb-6">
        Select your current qualification to see the real government and private paths open to you today.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(levelLabels).map(([level, label]) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <PageLoader message="Loading guide..." />}

      {!loading && !section && (
        <p className="text-gray-500">No guide available for this level yet.</p>
      )}

      {!loading && section && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-1">{section.title}</h2>
          {section.subtitle && (
            <p className="text-sm text-gray-500 mb-6 italic">{section.subtitle}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {section.groups.map((group, gi) => (
              <div key={gi} className="bg-white p-5 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  {group.heading.toLowerCase().includes('government') ? '🏛️' : '🏢'}{' '}
                  {group.heading}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {group.items.map((item, ii) => (
                    <li key={ii} className="flex gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {section.studyRoutes?.length > 0 && (
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">📚 Best Next-Study Routes</h3>
              <div className="flex flex-wrap gap-2">
                {section.studyRoutes.map((route, ri) => (
                  <span
                    key={ri}
                    className="bg-white text-blue-700 text-sm px-3 py-1.5 rounded-full border border-blue-200"
                  >
                    {route}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6 italic">
            Government recruitment is notification-based. Always check the exact age limit, qualification, percentage, and exam pattern in the current official notification before relying on this list.
          </p>
        </div>
      )}
    </div>
  );
}

export default QualificationGuide;
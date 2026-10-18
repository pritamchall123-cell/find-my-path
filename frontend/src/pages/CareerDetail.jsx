import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingTarget, setSettingTarget] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await axiosInstance.get(`/careers/${id}`);
        setCareer(res.data.career);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  const handleSetTarget = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSettingTarget(true);
    setMessage('');
    try {
      await axiosInstance.post('/skillgap/target', { careerId: id });
      setMessage('Target career set! Go to your dashboard to generate a roadmap.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSettingTarget(false);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (!career) return <p className="p-8 text-gray-500">Career not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-1 animate-fade-in-up">
        <span className="text-xs font-semibold text-blue-600 uppercase">{career.category}</span>
        {career.sector && (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
            {career.sector === 'both' ? 'Govt + Private' : career.sector === 'government' ? 'Government' : 'Private'}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold mt-1 mb-4 animate-fade-in-up delay-100">{career.name}</h1>
      <p className="text-gray-700 mb-6 animate-fade-in-up delay-200">{career.description}</p>

      {(career.approxStartingSalary || career.careerGrowth || career.examRequired) && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm animate-fade-in-up delay-300 hover:shadow-md transition-shadow">
          {career.approxStartingSalary && (
            <div>
              <p className="text-gray-500 text-xs">Starting Salary</p>
              <p className="font-semibold">{career.approxStartingSalary}</p>
            </div>
          )}
          {career.careerGrowth && (
            <div>
              <p className="text-gray-500 text-xs">Growth Path</p>
              <p className="font-semibold">{career.careerGrowth}</p>
            </div>
          )}
          {career.examRequired && (
            <div>
              <p className="text-gray-500 text-xs">Exam Required</p>
              <p className="font-semibold">{career.examRequired}</p>
            </div>
          )}
        </div>
      )}

      {career.dayInLife && (
        <div className="mb-6 animate-fade-in-up delay-400">
          <h2 className="text-lg font-semibold mb-2">A Day in This Career</h2>
          <p className="text-gray-700 bg-white p-4 rounded-lg shadow text-sm leading-relaxed hover:shadow-md transition-shadow">
            {career.dayInLife}
          </p>
        </div>
      )}

      {career.responsibilities?.length > 0 && (
        <div className="mb-6 animate-fade-in-up delay-500">
          <h2 className="text-lg font-semibold mb-2">Typical Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {career.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {career.coreSkills?.length > 0 && (
        <div className="mb-6 animate-fade-in-up delay-500">
          <h2 className="text-lg font-semibold mb-2">Core Skills</h2>
          <div className="flex flex-wrap gap-2">
            {career.coreSkills.map((cs, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full transition-transform hover:-translate-y-0.5 hover:bg-blue-200 cursor-default"
              >
                {cs.skill?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {(career.pros?.length > 0 || career.cons?.length > 0) && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up delay-500">
          {career.pros?.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg transition-transform hover:-translate-y-1">
              <h3 className="font-semibold text-green-800 mb-2 text-sm">👍 Pros</h3>
              <ul className="list-disc list-inside text-sm text-green-900 space-y-1">
                {career.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {career.cons?.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg transition-transform hover:-translate-y-1">
              <h3 className="font-semibold text-orange-800 mb-2 text-sm">⚠️ Honest Trade-offs</h3>
              <ul className="list-disc list-inside text-sm text-orange-900 space-y-1">
                {career.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {career.industryOutlook && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg animate-fade-in-up delay-500 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-blue-900 mb-1 text-sm">📊 Industry Outlook</h3>
          <p className="text-sm text-blue-900">{career.industryOutlook}</p>
        </div>
      )}

      {career.entryLevelRoles?.length > 0 && (
        <div className="mb-6 animate-fade-in-up delay-500">
          <h2 className="text-lg font-semibold mb-2">Entry-Level Roles</h2>
          <p className="text-gray-700">{career.entryLevelRoles.join(', ')}</p>
        </div>
      )}

      {career.exampleProjects?.length > 0 && (
        <div className="mb-6 animate-fade-in-up delay-500">
          <h2 className="text-lg font-semibold mb-2">Example Projects to Build</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {career.exampleProjects.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-4 italic">
        Salary, growth, and outlook figures are general platform guidance based on typical market trends — not a guarantee. Always verify with current sources before making major decisions.
      </p>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm animate-fade-in-up">
          {message}
        </div>
      )}

      <button
        onClick={handleSetTarget}
        disabled={settingTarget}
        className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
      >
        {settingTarget ? 'Setting...' : 'Set as My Target Career'}
      </button>
    </div>
  );
}

export default CareerDetail;
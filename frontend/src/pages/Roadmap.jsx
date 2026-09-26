import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRoadmap = async () => {
    try {
      const res = await axiosInstance.get('/roadmap/me');
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const res = await axiosInstance.post('/roadmap/generate');
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to generate roadmap. Have you set a target career?');
    } finally {
      setGenerating(false);
    }
  };

  const handleStepStatusChange = async (stepId, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/roadmap/step/${stepId}`, { status: newStatus });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Roadmap</h1>

      {message && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{message}</div>
      )}

      {!roadmap && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            You don't have a roadmap yet. Make sure you've set a target career, then generate one.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate My Roadmap'}
          </button>
        </div>
      )}

      {roadmap && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Target: {roadmap.targetCareer?.name || 'Career'}
          </h2>

          <div className="space-y-4">
            {roadmap.steps.map((step, index) => (
              <div key={step._id} className="bg-white p-5 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">
                    {index + 1}. {step.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : step.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {step.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mt-2">{step.description}</p>

                {step.skills?.length > 0 && (
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Skills:</span> {step.skills.join(', ')}
                  </p>
                )}

                {step.project && (
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Project:</span> {step.project}
                  </p>
                )}

                {step.estimatedEffort && (
                  <p className="text-sm mt-1 text-gray-500">Est. effort: {step.estimatedEffort}</p>
                )}

                <select
                  value={step.status}
                  onChange={(e) => handleStepStatusChange(step._id, e.target.value)}
                  className="mt-3 border rounded p-1 text-sm"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Roadmap;
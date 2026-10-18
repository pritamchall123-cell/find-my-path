import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function EducationPlanWidget() {
  const [savedInstitutions, setSavedInstitutions] = useState([]);
  const [scholarshipCount, setScholarshipCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instRes = await axiosInstance.get('/institutions/saved');
        setSavedInstitutions(instRes.data.savedInstitutions);
      } catch (err) {
        setSavedInstitutions([]);
      }

      try {
        const schRes = await axiosInstance.get('/scholarships', {
          params: user.educationLevel ? { educationLevel: user.educationLevel } : {},
        });
        setScholarshipCount(schRes.data.scholarships.length);
      } catch (err) {
        setScholarshipCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="font-bold text-lg mb-4">🎓 My Education Plan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-2xl font-extrabold text-indigo-700">{savedInstitutions.length}</p>
          <p className="text-sm text-gray-600 mb-2">Colleges saved</p>
          {savedInstitutions.length > 0 ? (
            <ul className="text-xs text-gray-700 space-y-1">
              {savedInstitutions.slice(0, 3).map((inst) => (
                <li key={inst._id}>• {inst.name}</li>
              ))}
            </ul>
          ) : (
            <Link to="/institutions" className="text-xs text-indigo-600 font-medium hover:underline">
              Browse colleges →
            </Link>
          )}
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-2xl font-extrabold text-amber-700">{scholarshipCount}</p>
          <p className="text-sm text-gray-600 mb-2">
            Scholarships {user.educationLevel ? `for your stage` : 'available'}
          </p>
          <Link to="/scholarships" className="text-xs text-amber-700 font-medium hover:underline">
            View scholarships →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EducationPlanWidget;
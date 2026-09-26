import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Assessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get('/assessment/questions');
        setQuestions(res.data.questions);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setSubmitting(true);
    setError('');

    const formattedAnswers = questions.map((q) => ({
      question: q._id,
      selectedValue: answers[q._id],
    }));

    try {
      await axiosInstance.post('/assessment/submit', { answers: formattedAnswers });
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryLabels = {
    interest: 'Interests',
    aptitude: 'Aptitude',
    workPreference: 'Work Preferences',
    skillConfidence: 'Skill Confidence',
  };

  if (loading) return <p className="p-8 text-gray-500">Loading assessment...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Career Assessment</h1>
      <p className="text-gray-600 mb-6">
        Answer honestly — this helps us find careers that genuinely fit you.
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q._id} className="bg-white p-5 rounded-lg shadow">
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {categoryLabels[q.category] || q.category}
            </span>
            <h3 className="font-medium mt-1 mb-3">
              {index + 1}. {q.text}
            </h3>

            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${
                    answers[q._id] === opt.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={q._id}
                    value={opt.value}
                    checked={answers[q._id] === opt.value}
                    onChange={() => handleSelect(q._id, opt.value)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Assessment'}
      </button>
    </div>
  );
}

export default Assessment;
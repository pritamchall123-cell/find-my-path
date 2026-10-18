import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Assessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [reflections, setReflections] = useState({ whatExcitesYou: '', recurringActivity: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClass10 = user.educationLevel === 'class10';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get('/assessment/questions', {
          params: { educationLevel: user.educationLevel },
        });
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
      await axiosInstance.post('/assessment/submit', {
        answers: formattedAnswers,
        reflections,
      });
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
      <h1 className="text-3xl font-bold mb-2">
        {isClass10 ? 'Discover Yourself' : 'Career Assessment'}
      </h1>
      <p className="text-gray-600 mb-6">
        {isClass10
          ? 'There are no wrong answers here — this just helps us understand what excites you.'
          : 'Answer honestly — this helps us find careers that genuinely fit you.'}
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

        {/* Reflection Prompts */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 className="font-semibold mb-1">A couple of open questions</h3>
          <p className="text-sm text-gray-600 mb-4">
            These aren't scored — they just help us (and the AI assistant) actually understand you, not just rate you.
          </p>

          <label className="block text-sm font-medium mb-1">
            Was there something in these questions that genuinely excited you? What was it, and why?
          </label>
          <textarea
            value={reflections.whatExcitesYou}
            onChange={(e) => setReflections({ ...reflections, whatExcitesYou: e.target.value })}
            placeholder="Optional, but the more honest you are, the more useful this is..."
            rows={3}
            className="w-full border rounded p-2 mb-4"
          />

          <label className="block text-sm font-medium mb-1">
            Is there something you keep coming back to — a hobby, a subject, a kind of problem — even outside school/college?
          </label>
          <textarea
            value={reflections.recurringActivity}
            onChange={(e) => setReflections({ ...reflections, recurringActivity: e.target.value })}
            placeholder="Optional..."
            rows={3}
            className="w-full border rounded p-2"
          />
        </div>
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
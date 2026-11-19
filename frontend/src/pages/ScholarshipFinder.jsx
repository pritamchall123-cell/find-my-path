import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const steps = ['education', 'location', 'eligibility', 'results'];

function ScholarshipFinder() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    educationLevel: '',
    state: '',
    category: 'general',
    incomeRange: '',
    isGirl: false,
    hasDisability: false,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFindMatches = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/scholarships/match', answers);
      setResults(res.data.results);
      next();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = steps[stepIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <Link to="/scholarships" className="text-sm text-blue-600 hover:underline">← Back to Scholarships</Link>
      <h1 className="text-3xl font-bold mt-2 mb-2">Scholarship Finder</h1>
      <p className="text-gray-600 mb-6">A few quick questions — skip anything you'd rather not answer.</p>

      {currentStep !== 'results' && (
        <div className="flex gap-1.5 mb-6">
          {steps.slice(0, 3).map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      )}

      {currentStep === 'education' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">What's your current education level?</h2>
          <div className="grid grid-cols-2 gap-3">
            {['class10', 'class12', 'diploma', 'college', 'graduate'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setAnswers({ ...answers, educationLevel: lvl })}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  answers.educationLevel === lvl ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'
                }`}
              >
                {lvl === 'class10' ? 'Class 10' : lvl === 'class12' ? 'Class 12' : lvl === 'diploma' ? 'Diploma/ITI' : lvl === 'college' ? 'College/UG' : 'Graduate'}
              </button>
            ))}
          </div>
          <button
            onClick={next}
            disabled={!answers.educationLevel}
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {currentStep === 'location' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Which state or UT are you from?</h2>
          <input
            type="text"
            placeholder="e.g. West Bengal (optional)"
            value={answers.state}
            onChange={(e) => setAnswers({ ...answers, state: e.target.value })}
            className="w-full border rounded p-2"
          />
          <p className="text-xs text-gray-400 mt-2">This helps us show both central and your state's scholarships.</p>
          <div className="flex gap-2 mt-6">
            <button onClick={back} className="text-gray-600 px-5 py-2 rounded font-semibold hover:bg-gray-100">Back</button>
            <button onClick={next} className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700">Next</button>
          </div>
        </div>
      )}

      {currentStep === 'eligibility' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">A few optional details</h2>
          <p className="text-sm text-gray-500 mb-4">
            These help narrow results to schemes you may specifically qualify for — skip anything you're not comfortable sharing.
          </p>

          <label className="block text-sm font-medium mb-1">Category (optional)</label>
          <select
            value={answers.category}
            onChange={(e) => setAnswers({ ...answers, category: e.target.value })}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="general">General / Prefer not to say</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="obc">OBC</option>
            <option value="ebc">EBC</option>
            <option value="dnt">DNT</option>
            <option value="minority">Minority community</option>
          </select>

          <label className="block text-sm font-medium mb-1">Family income range (optional)</label>
          <select
            value={answers.incomeRange}
            onChange={(e) => setAnswers({ ...answers, incomeRange: e.target.value })}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">Prefer not to say</option>
            <option value="below_1l">Below ₹1 Lakh/year</option>
            <option value="1l_2.5l">₹1-2.5 Lakh/year</option>
            <option value="2.5l_8l">₹2.5-8 Lakh/year</option>
            <option value="above_8l">Above ₹8 Lakh/year</option>
          </select>

          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={answers.isGirl}
              onChange={(e) => setAnswers({ ...answers, isGirl: e.target.checked })}
            />
            I am a girl/woman student
          </label>
          <label className="flex items-center gap-2 text-sm mb-4">
            <input
              type="checkbox"
              checked={answers.hasDisability}
              onChange={(e) => setAnswers({ ...answers, hasDisability: e.target.checked })}
            />
            I have a disability
          </label>

          <div className="flex gap-2">
            <button onClick={back} className="text-gray-600 px-5 py-2 rounded font-semibold hover:bg-gray-100">Back</button>
            <button
              onClick={handleFindMatches}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Finding matches...' : '🔍 Find My Scholarships'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 'results' && (
        <div>
          {loading && <PageLoader message="Matching scholarships..." />}
          {!loading && results && (
            <>
              <h2 className="font-bold text-lg mb-1">{results.length} Matching Scholarship(s)</h2>
              <p className="text-sm text-gray-500 mb-4">Sorted by how well each one matches your answers.</p>

              {results.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-500">No scholarships in our current database matched these specific answers.</p>
                  <Link to="/scholarships" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                    Browse all scholarships instead →
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                {results.map((r) => (
                  <div key={r.scholarship._id} className="bg-white p-5 rounded-lg shadow">
                    <h3 className="font-bold text-lg">{r.scholarship.name}</h3>

                    {r.matchedReasons.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-green-700 uppercase mb-1">Why this matches</p>
                        {r.matchedReasons.map((reason, i) => (
                          <p key={i} className="text-sm text-green-800">✓ {reason}</p>
                        ))}
                      </div>
                    )}

                    {r.unmetOrUnclear.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Verify before applying</p>
                        {r.unmetOrUnclear.map((note, i) => (
                          <p key={i} className="text-sm text-amber-800">⚠️ {note}</p>
                        ))}
                      </div>
                    )}

                    {r.scholarship.officialApplicationUrl && (
                      <a
                        href={r.scholarship.officialApplicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:underline mt-3 inline-block"
                      >
                        Visit Official Portal →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStepIndex(0); setResults(null); }}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Start over
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ScholarshipFinder;
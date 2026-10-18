import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function Resume() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axiosInstance.get('/resume/latest');
        setResume(res.data.resume);
      } catch (err) {
        setResume(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axiosInstance.post('/resume/upload', formData);
      setResume(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Resume Analyzer</h1>

      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">
          Upload your resume (PDF, max 5MB)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {resume && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <span className="text-2xl font-bold text-blue-600">
              {resume.analysis.alignmentScore}%
            </span>
          </div>

          <p className="text-gray-700 mb-4">{resume.analysis.summary}</p>

          {resume.analysis.skillsFound?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Skills Found</h3>
              <div className="flex flex-wrap gap-2">
                {resume.analysis.skillsFound.map((s, i) => (
                  <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.analysis.missingSkills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.analysis.missingSkills.map((s, i) => (
                  <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.analysis.suggestions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Suggestions</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                {resume.analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Resume;
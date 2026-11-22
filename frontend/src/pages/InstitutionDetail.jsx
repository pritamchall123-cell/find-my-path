import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import InstitutionMap from '../components/InstitutionMap';

const TYPE_LABEL = { government: 'Government', private: 'Private', deemed: 'Deemed' };

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const isHttp = (url) => /^https?:\/\//i.test(url || '');

function InstitutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inst, setInst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ok'); // ok | notfound | error
  const [saved, setSaved] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const load = async () => {
    setLoading(true);
    setStatus('ok');
    setImgFailed(false);
    try {
      const res = await axiosInstance.get(`/institutions/${id}`);
      setInst(res.data.institution);
    } catch (err) {
      setStatus(err.response?.status === 404 ? 'notfound' : 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    window.scrollTo({ top: 0 });
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    axiosInstance
      .get('/institutions/saved')
      .then((res) => setSaved(res.data.savedInstitutions.some((i) => i._id === id)))
      .catch(() => {});
  }, [id]);

  const toggleSave = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    try {
      const res = await axiosInstance.post('/institutions/save', { institutionId: id });
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (status !== 'ok' || !inst) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 max-w-xl mx-auto text-center">
        <p className="text-gray-700 mb-4">
          {status === 'notfound'
            ? "We couldn't find that college. It may have been removed."
            : "Couldn't load this college. Please check your connection."}
        </p>
        <div className="flex gap-3 justify-center">
          {status === 'error' && (
            <button onClick={load} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Try again
            </button>
          )}
          <Link to="/institutions" className="bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-semibold">
            Back to colleges
          </Link>
        </div>
      </div>
    );
  }

  const loc = inst.location || {};
  const coords = loc.coordinates || {};
  const hasCoords = coords.lat != null && coords.lng != null;
  const place = [loc.city, loc.district, loc.state].filter(Boolean).join(', ');
  const prov = inst.dataProvenance || {};
  const verified = prov.verificationStatus === 'verified';
  const showImage = inst.imageUrl && !imgFailed;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 max-w-5xl mx-auto">
      <Link to="/institutions" className="text-sm text-indigo-600 hover:underline">
        ← All colleges
      </Link>

      <div className="grid md:grid-cols-[320px_1fr] gap-6 mt-4">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          {showImage ? (
            <img
              src={inst.imageUrl}
              alt={inst.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-6xl font-bold tracking-wide opacity-90">
                {getInitials(inst.name)}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
              {TYPE_LABEL[inst.type] || inst.type}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {verified ? 'Details verified' : 'Details not yet verified'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{inst.name}</h1>
          {place && <p className="text-gray-600 mt-1">📍 {place}{loc.pincode ? ` – ${loc.pincode}` : ''}</p>}

          {inst.notableFor && <p className="text-gray-700 mt-4">{inst.notableFor}</p>}

          <div className="flex flex-wrap gap-3 mt-5">
            {isHttp(inst.website) && (
              <a
                href={inst.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Visit official website ↗
              </a>
            )}
            <button
              onClick={toggleSave}
              className="bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              {saved ? '🔖 Saved' : '🏷️ Save for later'}
            </button>
            {hasCoords && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                Open in Maps ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-3">Courses offered</h2>
          {inst.degreesOffered?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {inst.degreesOffered.map((d, i) => (
                <Link
                  key={i}
                  to={`/institutions?degree=${encodeURIComponent(d)}`}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-100"
                  title="See other colleges offering this"
                >
                  {d}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not listed yet.</p>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-3">Fees</h2>
          <p className="text-sm text-gray-700">
            {inst.approxFeesPerYear ? `💰 ${inst.approxFeesPerYear}` : 'Not listed yet.'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Fees change by course and year. Confirm the current figure on the official website.
          </p>
        </section>
      </div>

      {hasCoords && (
        <section className="mt-6">
          <h2 className="font-semibold mb-3">Location</h2>
          <InstitutionMap institutions={[inst]} userCoords={null} />
        </section>
      )}

      <section className="bg-white rounded-xl shadow-sm p-5 mt-6">
        <h2 className="font-semibold mb-2">About this information</h2>
        <p className="text-sm text-gray-600">
          Source: {prov.source || 'Not recorded'}
          {prov.lastVerifiedDate
            ? ` · Last verified ${new Date(prov.lastVerifiedDate).toLocaleDateString()}`
            : ''}
        </p>
        {!verified && (
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mt-3">
            ⚠️ These details have not been checked against the college's official sources. Please verify fees,
            courses and admission details directly with the institution before making decisions.
          </p>
        )}
      </section>
    </div>
  );
}

export default InstitutionDetail;
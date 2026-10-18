import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';
import InstitutionMap from '../components/InstitutionMap';

function Institutions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [degree, setDegree] = useState(searchParams.get('degree') || '');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');

  const handleSearch = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = {};
      const d = overrides.degree !== undefined ? overrides.degree : degree;
      const c = overrides.city !== undefined ? overrides.city : city;
      const p = overrides.pincode !== undefined ? overrides.pincode : pincode;
      const coordsToUse = overrides.coords !== undefined ? overrides.coords : coords;

      if (d) params.degree = d;
      if (c) params.city = c;
      if (p) params.pincode = p;
      if (coordsToUse) {
        params.lat = coordsToUse.lat;
        params.lng = coordsToUse.lng;
        if (maxDistanceKm) params.maxDistanceKm = maxDistanceKm;
      }

      const res = await axiosInstance.get('/institutions', { params });
      setInstitutions(res.data.institutions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access. Try entering your city or PIN code instead.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(newCoords);
        setLocating(false);
        handleSearch({ coords: newCoords });
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location access denied. No problem — just enter your city or PIN code below instead.");
        } else {
          setLocationError("Couldn't get your location. Try entering your city or PIN code instead.");
        }
      },
      { timeout: 10000 }
    );
  };

  const handleClearFilters = () => {
    setDegree('');
    setCity('');
    setPincode('');
    setCoords(null);
    setMaxDistanceKm('');
    handleSearch({ degree: '', city: '', pincode: '', coords: null });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleSaveInstitution = async (e, institutionId) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    try {
      const res = await axiosInstance.post('/institutions/save', { institutionId });
      if (res.data.saved) {
        setSavedIds((prev) => [...prev, institutionId]);
      } else {
        setSavedIds((prev) => prev.filter((id) => id !== institutionId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    navigate(`/compare-institutions?ids=${selected.join(',')}`);
  };

  useEffect(() => {
    if (searchParams.get('degree')) {
      handleSearch({ degree: searchParams.get('degree') });
    } else {
      handleSearch();
    }

    if (localStorage.getItem('token')) {
      axiosInstance
        .get('/institutions/saved')
        .then((res) => setSavedIds(res.data.savedInstitutions.map((i) => i._id)))
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Find Colleges</h1>
        {selected.length > 0 && (
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Compare Selected ({selected.length})
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-6">
        Browse all institutions below, or narrow down by degree and location.
      </p>

      <div className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
        <input
          type="text"
          placeholder="Degree — e.g. B.Tech Computer Science, MBBS, B.Com"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full border rounded p-2 bg-white"
        />

        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="City, district or state"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 min-w-[150px] border rounded p-2 bg-white text-sm"
          />
          <input
            type="text"
            placeholder="PIN code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-28 border rounded p-2 bg-white text-sm"
          />
          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded font-medium whitespace-nowrap disabled:opacity-50"
          >
            {locating ? '📍 Locating...' : '📍 Use My Location'}
          </button>
        </div>

        {coords && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              📍 Using your current location
            </span>
            <select
              value={maxDistanceKm}
              onChange={(e) => {
                setMaxDistanceKm(e.target.value);
                handleSearch();
              }}
              className="border rounded p-1 text-xs"
            >
              <option value="">Any distance</option>
              <option value="50">Within 50 km</option>
              <option value="150">Within 150 km</option>
              <option value="500">Within 500 km</option>
            </select>
          </div>
        )}

        {locationError && (
          <p className="text-amber-700 bg-amber-50 p-2 rounded text-xs">{locationError}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleSearch()}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
          >
            Search
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-100 text-gray-700 px-5 py-2 rounded font-semibold hover:bg-gray-200 text-sm"
          >
            Show All Colleges
          </button>
        </div>
      </div>

      {loading && <PageLoader message="Loading colleges..." />}

      {!loading && institutions.length === 0 && (
        <p className="text-gray-500">No institutions found matching your search.</p>
      )}

      {!loading && institutions.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{institutions.length} institution(s) found</p>
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  view === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                🗺️ Map
              </button>
            </div>
          </div>

          {view === 'map' && (
            <div className="mb-6">
              <InstitutionMap institutions={institutions} userCoords={coords} />
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-4">
              {institutions.map((inst) => (
                <div key={inst._id} className="bg-white p-5 rounded-lg shadow relative">
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <button
                      onClick={(e) => toggleSaveInstitution(e, inst._id)}
                      className="text-lg"
                      title={savedIds.includes(inst._id) ? 'Remove from saved' : 'Save for later'}
                    >
                      {savedIds.includes(inst._id) ? '🔖' : '🏷️'}
                    </button>
                    <label className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={selected.includes(inst._id)}
                        onChange={() => toggleSelect(inst._id)}
                      />
                      Compare
                    </label>
                  </div>
                  <div className="pr-32">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h2 className="font-bold text-lg">{inst.name}</h2>
                      {inst.distanceKm != null && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                          📍 {inst.distanceKm} km away
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                        {inst.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {inst.location?.city}, {inst.location?.state}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{inst.notableFor}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {inst.degreesOffered?.slice(0, 4).map((d, i) => (
                        <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      {inst.approxFeesPerYear && <span>💰 {inst.approxFeesPerYear}</span>}
                    </div>
                    {inst.dataProvenance?.verificationStatus === 'unverified' && (
                      <p className="text-[11px] text-amber-600 mt-2">
                        ⚠️ Fee and detail figures are approximate — verify with the official website.
                      </p>
                    )}
                    {inst.website && (
                      <a
                        href={inst.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <p className="text-xs text-gray-400 mt-6 italic">
        This is a small starter database, not an exhaustive list. Distances are straight-line estimates, not driving distance. Always verify current fees, cutoffs, and admission details directly with the institution.
      </p>
    </div>
  );
}

export default Institutions;
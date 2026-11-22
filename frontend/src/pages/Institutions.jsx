import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import InstitutionMap from '../components/InstitutionMap';
import CollegeCard from '../components/CollegeCard';

const PAGE_SIZE = 12;
const inputClass =
  'w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300';

function Institutions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters
  const [name, setName] = useState('');
  const [degree, setDegree] = useState(searchParams.get('degree') || '');
  const [stateFilter, setStateFilter] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState('');
  const [coords, setCoords] = useState(null);
  const [sort, setSort] = useState('default');

  // Data and UI state
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [view, setView] = useState('list');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [reloadKey, setReloadKey] = useState(0);

  const requestId = useRef(0);
  const firstRun = useRef(true);

  // One debounced fetch for every filter. Typing waits 400ms before asking the server.
  useEffect(() => {
    const delay = firstRun.current ? 0 : 400;
    firstRun.current = false;

    const timer = setTimeout(async () => {
      const myRequest = ++requestId.current;
      setRefreshing(true);
      setError(false);
      try {
        const params = {};
        if (name.trim()) params.name = name.trim();
        if (degree.trim()) params.degree = degree.trim();
        if (stateFilter) params.state = stateFilter;
        if (type) params.type = type;
        if (city.trim()) params.city = city.trim();
        if (pincode.trim()) params.pincode = pincode.trim();
        if (coords) {
          params.lat = coords.lat;
          params.lng = coords.lng;
          if (maxDistanceKm) params.maxDistanceKm = maxDistanceKm;
        }

        const res = await axiosInstance.get('/institutions', { params });
        if (myRequest !== requestId.current) return;
        setInstitutions(res.data.institutions);
        setVisibleCount(PAGE_SIZE);
      } catch (err) {
        if (myRequest !== requestId.current) return;
        setError(true);
        console.error(err);
      } finally {
        if (myRequest === requestId.current) {
          setRefreshing(false);
          setInitialLoading(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [name, degree, stateFilter, type, city, pincode, coords, maxDistanceKm, reloadKey]);

  // One-time: full list (for the State dropdown and the total count) and saved colleges.
  useEffect(() => {
    axiosInstance
      .get('/institutions')
      .then((res) => setAllInstitutions(res.data.institutions))
      .catch(() => {});

    if (localStorage.getItem('token')) {
      axiosInstance
        .get('/institutions/saved')
        .then((res) => setSavedIds(res.data.savedInstitutions.map((i) => i._id)))
        .catch(() => {});
    }
  }, []);

  const stateOptions = useMemo(() => {
    const set = new Set(allInstitutions.map((i) => i.location?.state).filter(Boolean));
    return [...set].sort();
  }, [allInstitutions]);

  const sorted = useMemo(() => {
    const list = [...institutions];
    if (sort === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [institutions, sort]);

  const visible = sorted.slice(0, visibleCount);

  const activeFilters = [
    name.trim(),
    degree.trim(),
    stateFilter,
    type,
    city.trim(),
    pincode.trim(),
    coords ? 'location' : '',
  ].filter(Boolean).length;

  const handleUseLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access. Try entering your city or PIN code instead.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      (geoError) => {
        setLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setLocationError('Location access denied. No problem — just enter your city or PIN code instead.');
        } else {
          setLocationError("Couldn't get your location. Try entering your city or PIN code instead.");
        }
      },
      { timeout: 10000 }
    );
  };

  const handleClearFilters = () => {
    setName('');
    setDegree('');
    setStateFilter('');
    setType('');
    setCity('');
    setPincode('');
    setCoords(null);
    setMaxDistanceKm('');
    setSort('default');
    setLocationError('');
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Explore Colleges</h1>
        {selected.length > 0 && (
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            Compare Selected ({selected.length})
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-6">
        Discover the right institution for your education and future.
      </p>

      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm mb-5 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Search colleges by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputClass} flex-1 min-w-[200px]`}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            aria-label="Sort colleges"
          >
            <option value="default">{coords ? 'Nearest first' : 'Name A–Z'}</option>
            <option value="za">Name Z–A</option>
            <option value="newest">Recently added</option>
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className={inputClass}>
            <option value="">All states</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="">All types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="deemed">Deemed</option>
          </select>
          <input
            type="text"
            placeholder="Course — e.g. B.Tech, MBBS"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className={`${inputClass} col-span-2`}
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="City or district"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`${inputClass} flex-1 min-w-[150px]`}
          />
          <input
            type="text"
            placeholder="PIN code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className={`${inputClass} w-28`}
          />
          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded-lg font-medium whitespace-nowrap disabled:opacity-50"
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
              onChange={(e) => setMaxDistanceKm(e.target.value)}
              className="border border-gray-300 rounded-lg p-1 text-xs"
            >
              <option value="">Any distance</option>
              <option value="50">Within 50 km</option>
              <option value="150">Within 150 km</option>
              <option value="500">Within 500 km</option>
            </select>
          </div>
        )}

        {locationError && (
          <p className="text-amber-700 bg-amber-50 p-2 rounded-lg text-xs">{locationError}</p>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-gray-600">
            {initialLoading
              ? 'Loading colleges...'
              : `Showing ${sorted.length} of ${Math.max(allInstitutions.length, sorted.length)} colleges`}
          </p>
          {activeFilters > 0 && (
            <button onClick={handleClearFilters} className="text-sm text-indigo-600 hover:underline">
              Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            📋 Gallery
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              view === 'map' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            🗺️ Map
          </button>
        </div>
      </div>

      {initialLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!initialLoading && error && (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-700 mb-3">Couldn't load colleges. Please check your connection.</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {!initialLoading && !error && sorted.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-700 mb-3">No colleges match your search.</p>
          {activeFilters > 0 && (
            <button
              onClick={handleClearFilters}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {!initialLoading && !error && sorted.length > 0 && (
        <div className={refreshing ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {view === 'map' && (
            <div className="mb-6">
              <InstitutionMap institutions={sorted} userCoords={coords} />
            </div>
          )}

          {view === 'list' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {visible.map((inst) => (
                  <CollegeCard
                    key={inst._id}
                    inst={inst}
                    saved={savedIds.includes(inst._id)}
                    selected={selected.includes(inst._id)}
                    onToggleSave={(e) => toggleSaveInstitution(e, inst._id)}
                    onToggleSelect={() => toggleSelect(inst._id)}
                  />
                ))}
              </div>
              {visible.length < sorted.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="bg-white shadow-sm px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50"
                  >
                    Show more ({sorted.length - visible.length} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 italic">
        This is a small starter database, not an exhaustive list. Distances are straight-line estimates, not driving distance. Always verify current fees, cutoffs, and admission details directly with the institution.
      </p>
    </div>
  );
}

export default Institutions;
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

function Careers() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axiosInstance.get('/careers');
        setCareers(res.data.careers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();

    if (token) {
      axiosInstance
        .get('/skillgap/saved')
        .then((res) => setSavedIds(res.data.savedCareers.map((c) => c._id)))
        .catch(() => {});
    }
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(careers.map((c) => c.category))];
    return ['All', ...unique.sort()];
  }, [careers]);

  const sectors = useMemo(() => {
    const unique = [...new Set(careers.filter((c) => c.sectorRef).map((c) => c.sectorRef.name))];
    return ['All', ...unique.sort()];
  }, [careers]);

  const skills = useMemo(() => {
    const all = careers.flatMap((c) =>
      (c.coreSkills || []).filter((cs) => cs.skill).map((cs) => cs.skill.name)
    );
    const unique = [...new Set(all)];
    return ['All', ...unique.sort()];
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesSector = sectorFilter === 'All' || c.sectorRef?.name === sectorFilter;
      const matchesSkill =
        skillFilter === 'All' ||
        (c.coreSkills || []).some((cs) => cs.skill?.name === skillFilter);
      return matchesSearch && matchesCategory && matchesSector && matchesSkill;
    });
  }, [careers, search, categoryFilter, sectorFilter, skillFilter]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleSave = async (e, careerId) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axiosInstance.post('/skillgap/save', { careerId });
      if (res.data.saved) {
        setSavedIds((prev) => [...prev, careerId]);
      } else {
        setSavedIds((prev) => prev.filter((id) => id !== careerId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    navigate(`/compare?ids=${selected.join(',')}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setSectorFilter('All');
    setSkillFilter('All');
  };

  const hasActiveFilters =
    search || categoryFilter !== 'All' || sectorFilter !== 'All' || skillFilter !== 'All';

  if (loading) return <PageLoader message="Loading careers..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Explore Careers</h1>
        {selected.length > 0 && (
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Compare Selected ({selected.length})
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            {skills.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'Any Skill' : s}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filteredCareers.length} career(s) found</p>

      {filteredCareers.length === 0 && (
        <p className="text-gray-500">No careers match your filters.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCareers.map((career) => (
          <div
            key={career._id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={(e) => toggleSave(e, career._id)}
                className="text-lg"
                aria-label="Save career"
                title={savedIds.includes(career._id) ? 'Remove from saved' : 'Save for later'}
              >
                {savedIds.includes(career._id) ? '🔖' : '🏷️'}
              </button>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={selected.includes(career._id)}
                  onChange={() => toggleSelect(career._id)}
                />
                Compare
              </label>
            </div>
            <Link to={`/careers/${career._id}`} className="block pr-20">
              <span className="text-xs font-semibold text-blue-600 uppercase">
                {career.category}
              </span>
              {career.sectorRef && (
                <span className="text-xs text-gray-400 ml-2">· {career.sectorRef.name}</span>
              )}
              <h2 className="text-lg font-bold mt-1">{career.name}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {career.description}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Careers;
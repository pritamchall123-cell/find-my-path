import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const emptyForm = {
  name: '',
  type: 'private',
  city: '',
  district: '',
  state: '',
  pincode: '',
  lat: '',
  lng: '',
  degreesOffered: '',
  approxFeesPerYear: '',
  notableFor: '',
  website: '',
  imageUrl: '',
  verificationStatus: 'unverified',
  source: '',
  lastVerifiedDate: '',
};

const TYPE_LABEL = { government: 'Government', private: 'Private', deemed: 'Deemed' };
const inputClass =
  'w-full border border-gray-300 rounded-lg p-2 text-sm bg-white mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300';

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const hasCoords = (c) =>
  c.location?.coordinates?.lat != null && c.location?.coordinates?.lng != null;

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

function Thumb({ college }) {
  const [broken, setBroken] = useState(false);
  if (college.imageUrl && !broken) {
    return (
      <img
        src={college.imageUrl}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-lg shrink-0 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
      {getInitials(college.name)}
    </div>
  );
}

function Badge({ children, tone = 'gray' }) {
  const tones = {
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
}

function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [attentionFilter, setAttentionFilter] = useState('all');
  const [imgBroken, setImgBroken] = useState(false);

  const fetchColleges = async () => {
    setLoadError(false);
    try {
      const res = await axiosInstance.get('/institutions');
      setColleges(res.data.institutions);
    } catch (err) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    setImgBroken(false);
  }, [form.imageUrl]);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setError('');
    setSuccess('');
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (c) => {
    setError('');
    setSuccess('');
    setEditingId(c._id);
    setForm({
      name: c.name || '',
      type: c.type || 'private',
      city: c.location?.city || '',
      district: c.location?.district || '',
      state: c.location?.state || '',
      pincode: c.location?.pincode || '',
      lat: c.location?.coordinates?.lat ?? '',
      lng: c.location?.coordinates?.lng ?? '',
      degreesOffered: (c.degreesOffered || []).join(', '),
      approxFeesPerYear: c.approxFeesPerYear || '',
      notableFor: c.notableFor || '',
      website: c.website || '',
      imageUrl: c.imageUrl || '',
      verificationStatus: c.dataProvenance?.verificationStatus || 'unverified',
      source: c.dataProvenance?.source || '',
      lastVerifiedDate: (c.dataProvenance?.lastVerifiedDate || '').slice(0, 10),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const dataProvenance = {
      source: form.source,
      verificationStatus: form.verificationStatus,
    };
    if (form.verificationStatus === 'verified' && form.lastVerifiedDate) {
      dataProvenance.lastVerifiedDate = form.lastVerifiedDate;
    }

    const payload = {
      name: form.name,
      type: form.type,
      location: {
        city: form.city,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        coordinates: { lat: form.lat, lng: form.lng },
      },
      degreesOffered: form.degreesOffered,
      approxFeesPerYear: form.approxFeesPerYear,
      notableFor: form.notableFor,
      website: form.website,
      imageUrl: form.imageUrl,
      dataProvenance,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/admin/institutions/${editingId}`, payload);
        setSuccess('College updated.');
      } else {
        await axiosInstance.post('/admin/institutions', payload);
        setSuccess('College added.');
      }
      closeForm();
      fetchColleges();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the college.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? It will also be removed from students' saved lists.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await axiosInstance.delete(`/admin/institutions/${c._id}`);
      if (editingId === c._id) closeForm();
      setSuccess('College deleted.');
      fetchColleges();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the college.');
    }
  };

  const counts = useMemo(
    () => ({
      unverified: colleges.filter((c) => c.dataProvenance?.verificationStatus !== 'verified').length,
      noImage: colleges.filter((c) => !c.imageUrl).length,
      noCoords: colleges.filter((c) => !hasCoords(c)).length,
    }),
    [colleges]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return colleges.filter((c) => {
      if (q) {
        const haystack = [c.name, c.location?.city, c.location?.state].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      if (attentionFilter === 'unverified' && c.dataProvenance?.verificationStatus === 'verified') return false;
      if (attentionFilter === 'noImage' && c.imageUrl) return false;
      if (attentionFilter === 'noCoords' && hasCoords(c)) return false;
      return true;
    });
  }, [colleges, search, typeFilter, attentionFilter]);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Colleges</h1>
          <p className="text-gray-600">
            {colleges.length} in total. Changes show on Explore Colleges right away.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-sm"
          >
            + Add College
          </button>
        )}
      </div>

      {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm mb-8 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit College' : 'Add New College'}</h2>
            <button type="button" onClick={closeForm} className="text-sm text-gray-600 hover:underline">
              Cancel
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="College name *">
              <input className={inputClass} value={form.name} onChange={setField('name')} required />
            </Field>
            <Field label="Type">
              <select className={inputClass} value={form.type} onChange={setField('type')}>
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="deemed">Deemed</option>
              </select>
            </Field>
            <Field label="City">
              <input className={inputClass} value={form.city} onChange={setField('city')} />
            </Field>
            <Field label="District">
              <input className={inputClass} value={form.district} onChange={setField('district')} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={form.state} onChange={setField('state')} />
            </Field>
            <Field label="PIN code">
              <input className={inputClass} value={form.pincode} onChange={setField('pincode')} />
            </Field>
            <Field label="Latitude" hint="Used for the map and distance search.">
              <input className={inputClass} value={form.lat} onChange={setField('lat')} placeholder="e.g. 22.5726" />
            </Field>
            <Field label="Longitude" hint="Tip: on Google Maps, right-click the college and copy the two numbers.">
              <input className={inputClass} value={form.lng} onChange={setField('lng')} placeholder="e.g. 88.3639" />
            </Field>
          </div>

          <Field label="Degrees offered" hint="Separate with commas, e.g. B.Tech Computer Science, B.Com, MBA">
            <input className={inputClass} value={form.degreesOffered} onChange={setField('degreesOffered')} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Approximate fees per year">
              <input className={inputClass} value={form.approxFeesPerYear} onChange={setField('approxFeesPerYear')} />
            </Field>
            <Field label="Website">
              <input className={inputClass} value={form.website} onChange={setField('website')} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Notable for">
            <textarea className={inputClass} rows={2} value={form.notableFor} onChange={setField('notableFor')} />
          </Field>

          <div>
            <Field label="Image link" hint="A link starting with https://. Use only images you have the right to use.">
              <input className={inputClass} value={form.imageUrl} onChange={setField('imageUrl')} placeholder="https://..." />
            </Field>
            {form.imageUrl && (
              <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-xs text-gray-500 text-center p-2">
                {imgBroken ? (
                  'Image could not load. Check the link.'
                ) : (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    onError={() => setImgBroken(true)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Data status" hint="Mark verified only after checking the college's official site.">
              <select className={inputClass} value={form.verificationStatus} onChange={setField('verificationStatus')}>
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
                <option value="user-submitted">User-submitted</option>
              </select>
            </Field>
            <Field label="Source" hint="Where the details came from, e.g. the college's official website.">
              <input className={inputClass} value={form.source} onChange={setField('source')} />
            </Field>
            {form.verificationStatus === 'verified' && (
              <Field label="Date verified" hint="Leave empty to use today.">
                <input type="date" className={inputClass} value={form.lastVerifiedDate} onChange={setField('lastVerifiedDate')} />
              </Field>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add College'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <input
          className={inputClass}
          placeholder="Search by name, city or state"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
          >
            <option value="all">All types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="deemed">Deemed</option>
          </select>
          <select
            value={attentionFilter}
            onChange={(e) => setAttentionFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
          >
            <option value="all">Everything</option>
            <option value="unverified">Not verified ({counts.unverified})</option>
            <option value="noImage">No image ({counts.noImage})</option>
            <option value="noCoords">No map location ({counts.noCoords})</option>
          </select>
          {(search || typeFilter !== 'all' || attentionFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setAttentionFilter('all');
              }}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            Showing {filtered.length} of {colleges.length}
          </span>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading colleges...</p>}

      {!loading && loadError && (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-700 mb-3">Couldn't load colleges.</p>
          <button
            onClick={fetchColleges}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !loadError && filtered.length === 0 && (
        <p className="text-gray-500">No colleges match these filters.</p>
      )}

      <div className="space-y-3">
        {filtered.map((c) => {
          const verified = c.dataProvenance?.verificationStatus === 'verified';
          return (
            <div key={c._id} className="bg-white rounded-xl shadow-sm p-3 flex gap-3 items-center">
              <Thumb college={c} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {[c.location?.city, c.location?.state].filter(Boolean).join(', ') || 'No location'}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <Badge tone="indigo">{TYPE_LABEL[c.type] || c.type}</Badge>
                  <Badge tone={verified ? 'green' : 'amber'}>{verified ? 'Verified' : 'Unverified'}</Badge>
                  {!c.imageUrl && <Badge>No image</Badge>}
                  {!hasCoords(c) && <Badge>No map pin</Badge>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminColleges;
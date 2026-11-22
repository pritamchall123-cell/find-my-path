import { useState } from 'react';
import { Link } from 'react-router-dom';

const PALETTE = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-fuchsia-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
];

const TYPE_LABEL = { government: 'Government', private: 'Private', deemed: 'Deemed' };

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const colorFor = (name = '') => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

function CollegeCard({ inst, saved, selected, onToggleSave, onToggleSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = inst.imageUrl && !imgFailed;
  const detailsPath = `/institutions/${inst._id}`;
  const degrees = inst.degreesOffered || [];

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative">
        <Link to={detailsPath} aria-label={`View details of ${inst.name}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            {showImage ? (
              <img
                src={inst.imageUrl}
                alt={inst.name}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${colorFor(
                  inst.name
                )} flex items-center justify-center`}
              >
                <span className="text-white text-4xl font-bold tracking-wide opacity-90">
                  {getInitials(inst.name)}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            onClick={onToggleSave}
            className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-base"
            title={saved ? 'Remove from saved' : 'Save for later'}
          >
            {saved ? '🔖' : '🏷️'}
          </button>
          <label className="flex items-center gap-1 text-xs bg-white/90 shadow px-2 py-1 rounded-full cursor-pointer">
            <input type="checkbox" checked={selected} onChange={onToggleSelect} />
            Compare
          </label>
        </div>

        {inst.distanceKm != null && (
          <span className="absolute bottom-2 left-2 text-xs bg-white/90 text-green-700 shadow px-2 py-1 rounded-full">
            📍 {inst.distanceKm} km away
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link to={detailsPath}>
          <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.75rem]">
            {inst.name}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {[inst.location?.city, inst.location?.state].filter(Boolean).join(', ')}
        </p>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
            {TYPE_LABEL[inst.type] || inst.type}
          </span>
          {inst.approxFeesPerYear && (
            <span className="text-xs text-gray-500 truncate">💰 {inst.approxFeesPerYear}</span>
          )}
        </div>

        {degrees.length > 0 && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {degrees.slice(0, 2).join(' · ')}
            {degrees.length > 2 ? ` +${degrees.length - 2} more` : ''}
          </p>
        )}

        <Link
          to={detailsPath}
          className="mt-auto pt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default CollegeCard;
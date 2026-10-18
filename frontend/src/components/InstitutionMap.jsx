import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'hue-rotate-180',
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center]);
  return null;
}

function InstitutionMap({ institutions, userCoords }) {
  const withCoords = institutions.filter(
    (inst) => inst.location?.coordinates?.lat != null && inst.location?.coordinates?.lng != null
  );

  const defaultCenter = userCoords
    ? [userCoords.lat, userCoords.lng]
    : withCoords.length > 0
    ? [withCoords[0].location.coordinates.lat, withCoords[0].location.coordinates.lng]
    : [22.9734, 78.6569];

  if (withCoords.length === 0 && !userCoords) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 text-sm">
        No institutions with location data to show on the map yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow" style={{ height: '400px' }}>
      <MapContainer center={defaultCenter} zoom={userCoords ? 10 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={defaultCenter} />

        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {withCoords.map((inst) => (
          <Marker
            key={inst._id}
            position={[inst.location.coordinates.lat, inst.location.coordinates.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <strong>{inst.name}</strong>
              <br />
              {inst.location.city}, {inst.location.state}
              {inst.distanceKm != null && (
                <>
                  <br />
                  📍 {inst.distanceKm} km away
                </>
              )}
              {inst.website && (
                <>
                  <br />
                  <a href={inst.website} target="_blank" rel="noopener noreferrer">
                    Visit website →
                  </a>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default InstitutionMap;
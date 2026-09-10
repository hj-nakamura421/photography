'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import photographs from './archive.json';
import { locationCoordinates } from './location-data';

type Photograph = {
  id: string;
  number: number;
  alt: string;
  width: number;
  height: number;
  location: string | null;
  category: string;
};

type LocationGroup = {
  location: string;
  coordinates: [number, number];
  photographs: Photograph[];
};

export default function LocationExplorer({ basePath }: { basePath: string }) {
  const groups = useMemo<LocationGroup[]>(() => {
    const grouped = new Map<string, Photograph[]>();
    for (const photograph of photographs as Photograph[]) {
      if (!photograph.location || photograph.category === 'School' || photograph.category === '25') continue;
      if (!locationCoordinates[photograph.location]) continue;
      const group = grouped.get(photograph.location) ?? [];
      group.push(photograph);
      grouped.set(photograph.location, group);
    }
    return [...grouped.entries()]
      .map(([location, entries]) => ({ location, coordinates: locationCoordinates[location], photographs: entries }))
      .sort((left, right) => right.photographs.length - left.photographs.length || left.location.localeCompare(right.location));
  }, []);
  const [selected, setSelected] = useState(groups[0]?.location ?? '');
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);
  const selectedGroup = groups.find(group => group.location === selected) ?? groups[0];

  useEffect(() => {
    let disposed = false;
    let map: import('leaflet').Map | null = null;
    void import('leaflet').then(L => {
      if (disposed || !mapElement.current) return;
      map = L.map(mapElement.current, {
        scrollWheelZoom: true,
        touchZoom: true,
        zoomSnap: 0.25,
        wheelPxPerZoomLevel: 80,
        minZoom: 2,
        worldCopyJump: true,
      }).setView([43, 15], 2);
      mapInstance.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      for (const group of groups) {
        const marker = L.circleMarker(group.coordinates, {
          radius: Math.min(15, 5 + Math.sqrt(group.photographs.length) * 0.7),
          color: '#fff8f0',
          weight: 2.5,
          fillColor: '#c43d2f',
          fillOpacity: 0.96,
        }).addTo(map);
        marker.bindTooltip(`${group.location} · ${group.photographs.length}`, { direction: 'top', offset: [0, -5] });
        marker.on('click', () => setSelected(group.location));
      }
    });
    return () => {
      disposed = true;
      mapInstance.current = null;
      map?.remove();
    };
  }, [groups]);

  function chooseLocation(group: LocationGroup) {
    setSelected(group.location);
    mapInstance.current?.flyTo(group.coordinates, group.location.includes('Scotland') || group.location.includes('England') ? 7 : 6, { duration: 0.8 });
    document.getElementById('location-photographs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!selectedGroup) return <p className="location-empty">No confirmed locations yet.</p>;

  return (
    <>
      <div className="location-explorer">
        <div className="location-map-wrap">
          <div ref={mapElement} className="location-map" aria-label="Map of photographed locations" />
          <p className="map-note">Pinch or use two fingers to zoom. Marker size reflects the number of photographs.</p>
        </div>
        <nav className="location-list" aria-label="Photographed locations">
          {groups.map(group => (
            <button
              key={group.location}
              type="button"
              className="location-choice"
              aria-current={selected === group.location ? 'true' : undefined}
              onClick={() => chooseLocation(group)}
            >
              <span>{group.location}</span>
              <span>{group.photographs.length}</span>
            </button>
          ))}
        </nav>
      </div>
      <section id="location-photographs" className="location-results" aria-labelledby="location-results-title">
        <div className="location-results-heading">
          <h3 id="location-results-title">{selectedGroup.location}</h3>
          <span>{selectedGroup.photographs.length.toLocaleString('en-GB')} photographs</span>
        </div>
        <div className="location-photo-grid">
          {selectedGroup.photographs.map(photograph => (
            <a key={photograph.id} href={`${basePath}/photos/${photograph.id}.jpg`} target="_blank" rel="noreferrer" aria-label={`Open photograph ${photograph.number} from ${selectedGroup.location}`}>
              <img src={`${basePath}/archive/${photograph.id}-thumb.webp`} alt={photograph.alt} width={photograph.width} height={photograph.height} loading="lazy" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

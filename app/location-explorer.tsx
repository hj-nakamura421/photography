'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { shufflePhotographs } from '@/lib/gallery-collection.mjs';
import photographs from './archive.json';
import { locationCoordinates } from './location-data';

type Photograph = {
  id: string;
  number: number;
  alt: string;
  width: number;
  height: number;
  monochrome: boolean;
  date: string | null;
  location: string | null;
  category: string;
};

type LocationGroup = {
  location: string;
  coordinates: [number, number];
  photographs: Photograph[];
};

function captureDate(value: string | null) {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

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
  const [shuffledGroups, setShuffledGroups] = useState(groups);
  const [selected, setSelected] = useState(groups[0]?.location ?? '');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);
  const selectedGroup = shuffledGroups.find(group => group.location === selected) ?? shuffledGroups[0];
  const current = selectedGroup?.photographs[index] ?? selectedGroup?.photographs[0];

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setShuffledGroups(groups.map(group => ({ ...group, photographs: shufflePhotographs(group.photographs) })));
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [groups]);

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
          stroke: false,
          fillColor: '#c43d2f',
          fillOpacity: 0.96,
        }).addTo(map);
        marker.bindTooltip(`${group.location} · ${group.photographs.length}`, { direction: 'top', offset: [0, -5] });
        marker.on('click', () => {
          setSelected(group.location);
          setIndex(0);
          setOpen(false);
        });
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
    setIndex(0);
    setOpen(false);
    mapInstance.current?.flyTo(group.coordinates, group.location.includes('Scotland') || group.location.includes('England') ? 7 : 6, { duration: 0.8 });
    document.getElementById('location-photographs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function move(direction: number) {
    if (!selectedGroup) return;
    setLoaded(false);
    setImageFailed(false);
    setIndex(value => ((value + direction) % selectedGroup.photographs.length + selectedGroup.photographs.length) % selectedGroup.photographs.length);
  }

  if (!selectedGroup || !current) return <p className="location-empty">No confirmed locations yet.</p>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="location-explorer">
        <div className="location-map-wrap">
          <div ref={mapElement} className="location-map" aria-label="Map of photographed locations" />
        </div>
        <nav className="location-list" aria-label="Photographed locations">
          {groups.map(group => (
            <button key={group.location} type="button" className="location-choice" aria-current={selected === group.location ? 'true' : undefined} onClick={() => chooseLocation(group)}>
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
          {selectedGroup.photographs.map((photograph, position) => (
            <DialogTrigger key={photograph.id} render={<Button variant="ghost" className="location-photo-button" />} onClick={() => { setIndex(position); setLoaded(false); setImageFailed(false); }} aria-label={`View photograph ${photograph.number} from ${selectedGroup.location}`}>
              <img src={`${basePath}/archive/${photograph.id}-thumb.webp`} alt={photograph.alt} width={photograph.width} height={photograph.height} loading="lazy" />
            </DialogTrigger>
          ))}
        </div>
      </section>
      <DialogContent className="photo-dialog" showCloseButton={false} onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      }}>
        <div className="viewer-header">
          <span className="viewer-brand">Hinata Justin Nakamura</span>
          <span className="viewer-position">{index + 1} / {selectedGroup.photographs.length.toLocaleString('en-GB')}</span>
          <DialogClose render={<Button variant="ghost" className="viewer-button viewer-close" />} aria-label="Close photograph"><X size={22} /></DialogClose>
        </div>
        <div className="viewer-body">
          <div className="viewer-stage">
            <Button variant="ghost" className="viewer-button viewer-step viewer-previous" onClick={() => move(-1)} aria-label="Previous photograph"><ArrowLeft size={24} /></Button>
            <div className="viewer-image">
              {open && <img key={current.id} src={`${basePath}/photos/${current.id}.jpg`} alt={current.alt} width={current.width} height={current.height} onLoad={() => setLoaded(true)} onError={() => { setImageFailed(true); setLoaded(true); }} />}
              {open && !loaded && <span className="viewer-loading" role="status">Loading photograph…</span>}
              {imageFailed && <span className="viewer-loading" role="alert">This photograph couldn’t load. Try the original file below.</span>}
            </div>
            <Button variant="ghost" className="viewer-button viewer-step viewer-next" onClick={() => move(1)} aria-label="Next photograph"><ArrowRight size={24} /></Button>
          </div>
          <aside className="viewer-panel" aria-live="polite">
            <DialogTitle className="sr-only">Photograph {current.number}</DialogTitle>
            <DialogDescription className="sr-only">{current.alt}</DialogDescription>
            <dl className="viewer-metadata">
              <div><dt>Taken</dt><dd>{captureDate(current.date)}</dd></div>
              <div><dt>Location</dt><dd>{current.location ?? 'Not recorded'}</dd></div>
              <div><dt>Collection</dt><dd>{current.category}</dd></div>
              <div><dt>Format</dt><dd>{current.monochrome ? 'Black & white' : 'Colour'} · {current.width >= current.height ? 'Landscape' : 'Portrait'}</dd></div>
            </dl>
            <div className="viewer-panel-footer">
              <a className="original-link" href={`${basePath}/photos/${current.id}.jpg`} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={12} /></a>
              <span>© Hinata Justin Nakamura · All rights reserved.<br />Use arrow keys to explore</span>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

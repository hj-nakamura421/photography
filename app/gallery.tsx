'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PAGE_SIZE, filterPhotographs, pageCountFor, photographPage, nextPhotographIndex, shufflePhotographs } from '@/lib/gallery-collection.mjs';
import photographs from './archive.json';
import { categories, categoryHref, type Category } from './categories';

const BASE_PATH = '/photography';
type Colour = 'all' | 'colour' | 'monochrome';
type Format = 'all' | 'portrait' | 'landscape';
type Photograph = {
  id: string;
  number: number;
  title: string;
  alt: string;
  width: number;
  height: number;
  monochrome: boolean;
  date: string | null;
  selected: boolean;
  featured: number;
  category: string;
};

const archive = photographs as Photograph[];
const knownLocations: Record<string, string> = {};

function captureDate(value: string | null) {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export default function Gallery({ initialCategory = 'All work' }: { initialCategory?: Category }) {
  const category = initialCategory;
  const [colour, setColour] = useState<Colour>('all');
  const [format, setFormat] = useState<Format>('all');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [orderedPhotographs, setOrderedPhotographs] = useState<Photograph[]>(archive);
  const heading = useRef<HTMLHeadingElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setOrderedPhotographs(shufflePhotographs(archive));
  }, []);
  const filtered = useMemo(() => filterPhotographs(orderedPhotographs, colour, format, category), [orderedPhotographs, category, colour, format]);
  const pages = pageCountFor(filtered.length);
  const shown = photographPage(filtered, page);
  const current = filtered[index] ?? filtered[0];
  const fullSource = (photo: Photograph) => BASE_PATH + '/photos/' + photo.id + '.jpg';
  const move = (direction: number) => {
    setLoaded(false);
    setImageFailed(false);
    setIndex(value => nextPhotographIndex(value, direction, filtered.length));
  };
  function changePage(value: number) {
    setPage(Math.max(0, Math.min(value, pages - 1)));
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function resetCollection() {
    setPage(0);
    setIndex(0);
    setLoaded(false);
    setImageFailed(false);
  }

  function photoCard(photo: Photograph, position: number) {
    const absoluteIndex = page * PAGE_SIZE + position;
    return <figure className="photograph" key={photo.id}>
      <DialogTrigger
        render={<Button variant="ghost" className="photo-button" />}
        onClick={() => { setIndex(absoluteIndex); setLoaded(false); setImageFailed(false); }}
        aria-label={photo.title ? 'View ' + photo.title + ' full screen' : 'View school photograph full screen'}
      >
        <img src={BASE_PATH + '/archive/' + photo.id + '-thumb.webp'} alt={photo.alt} width={photo.width} height={photo.height} loading={position < 3 ? 'eager' : 'lazy'} fetchPriority={position === 0 ? 'high' : 'auto'} decoding="async" />
        <span className="photo-open" aria-hidden="true"><Maximize2 size={16} /></span>
      </DialogTrigger>
      {photo.category !== 'School' && <figcaption><span>{photo.title}</span><span>{photo.category}</span></figcaption>}
    </figure>;
  }

  function pagination(location: string) {
    return <nav className="archive-pagination" aria-label={'Gallery pages, ' + location}>
      <Button variant="ghost" className="page-arrow" disabled={page === 0} onClick={() => changePage(page - 1)} aria-label="Previous page"><ArrowLeft size={18} /></Button>
      <NativeSelect className="page-select" aria-label={'Choose page, ' + location} value={page} onChange={event => changePage(Number(event.target.value))}>
        {Array.from({ length: pages }, (_, number) => <NativeSelectOption key={number} value={number}>Page {number + 1} of {pages}</NativeSelectOption>)}
      </NativeSelect>
      <Button variant="ghost" className="page-arrow" disabled={page === pages - 1} onClick={() => changePage(page + 1)} aria-label="Next page"><ArrowRight size={18} /></Button>
    </nav>;
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <h3 ref={heading} tabIndex={-1} className="archive-heading">Photographs</h3>
    <div className="gallery-toolbar archive-toolbar">
      <div className="gallery-filters" role="group" aria-label="Filter photographs by subject">
        {categories.map(item => <a key={item} className="filter-button" aria-current={category === item ? 'page' : undefined} href={categoryHref(item, BASE_PATH)}>{item}</a>)}
      </div>
      <div className="gallery-refinements">
        <label className="colour-filter"><span className="sr-only">Photograph colour treatment</span><NativeSelect value={colour} onChange={event => { setColour(event.target.value as Colour); resetCollection(); }}>
          <NativeSelectOption value="all">All palettes</NativeSelectOption>
          <NativeSelectOption value="colour">Colour</NativeSelectOption>
          <NativeSelectOption value="monochrome">Black & white</NativeSelectOption>
        </NativeSelect></label>
        <label className="format-filter"><span className="sr-only">Photograph orientation</span><NativeSelect value={format} onChange={event => { setFormat(event.target.value as Format); resetCollection(); }}>
          <NativeSelectOption value="all">All formats</NativeSelectOption>
          <NativeSelectOption value="portrait">Portrait format</NativeSelectOption>
          <NativeSelectOption value="landscape">Landscape format</NativeSelectOption>
        </NativeSelect></label>
      </div>
    </div>
    <div className="archive-page-bar">
      <p className="gallery-count" aria-live="polite">{filtered.length ? (page * PAGE_SIZE + 1).toLocaleString('en-GB') + '–' + Math.min((page + 1) * PAGE_SIZE, filtered.length).toLocaleString('en-GB') : '0'} of {filtered.length.toLocaleString('en-GB')} photographs</p>
      {pagination('top')}
    </div>
    {shown.length ? <div className="collection-grid filtered-grid">{shown.map((photo, position) => photoCard(photo, position))}</div> :
      <div className="archive-empty"><p>No photographs match these filters.</p><Button variant="outline" onClick={() => { setColour('all'); setFormat('all'); resetCollection(); }}>Show all photographs</Button></div>}
    <div className="gallery-end archive-end">
      {pagination('bottom')}
      <a className="text-link" href="https://www.instagram.com/hj_nakamura/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a>
    </div>
    {current && <DialogContent className="photo-dialog" showCloseButton={false} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    }}>
      <div className="viewer-header">
        <span className="viewer-brand">Hinata Justin Nakamura</span>
        <span className="viewer-position">{index + 1} / {filtered.length.toLocaleString('en-GB')}</span>
        <DialogClose render={<Button variant="ghost" className="viewer-button viewer-close" />} aria-label="Close photograph"><X size={22} /></DialogClose>
      </div>
      <div className="viewer-body">
        <div className="viewer-stage">
          <Button variant="ghost" className="viewer-button viewer-step viewer-previous" onClick={() => move(-1)} aria-label="Previous photograph"><ArrowLeft size={24} /></Button>
          <div className="viewer-image" onTouchStart={event => { if (event.touches.length === 1) touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; else touchStart.current = null; }} onTouchEnd={event => {
            if (!touchStart.current || !event.changedTouches[0]) return;
            const dx = event.changedTouches[0].clientX - touchStart.current.x;
            const dy = event.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}>
            {open && <img key={current.id} src={fullSource(current)} alt={current.alt} width={current.width} height={current.height} onLoad={() => setLoaded(true)} onError={() => { setImageFailed(true); setLoaded(true); }} />}
            {open && !loaded && <span className="viewer-loading" role="status">Loading photograph…</span>}
            {imageFailed && <span className="viewer-loading" role="alert">This photograph couldn’t load. Try the original file below.</span>}
          </div>
          <Button variant="ghost" className="viewer-button viewer-step viewer-next" onClick={() => move(1)} aria-label="Next photograph"><ArrowRight size={24} /></Button>
        </div>
        <aside className="viewer-panel" aria-live="polite">
          <div className="viewer-caption">
            <DialogTitle className={current.title ? undefined : 'sr-only'}>{current.title || 'School photograph'}</DialogTitle>
            <DialogDescription>{current.alt}</DialogDescription>
          </div>
          <dl className="viewer-metadata">
            <div><dt>Taken</dt><dd>{captureDate(current.date)}</dd></div>
            <div><dt>Location</dt><dd>{knownLocations[current.id] ?? 'Not recorded'}</dd></div>
            <div><dt>Collection</dt><dd>{current.category}</dd></div>
            <div><dt>Format</dt><dd>{current.monochrome ? 'Black & white' : 'Colour'} · {current.width >= current.height ? 'Landscape' : 'Portrait'}</dd></div>
          </dl>
          <div className="viewer-panel-footer">
            <a className="original-link" href={fullSource(current)} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={12} /></a>
            <span>© Hinata Justin Nakamura · All rights reserved.<br />Use arrow keys or swipe to explore</span>
          </div>
        </aside>
      </div>
    </DialogContent>}
  </Dialog>;
}

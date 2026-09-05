'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PAGE_SIZE, filterPhotographs, pageCountFor, photographPage, nextPhotographIndex } from '@/lib/gallery-collection.mjs';
import photographs from './archive.json';

const BASE_PATH = '/photography';

const categories = [
  'All work',
  'People & Street',
  'Buildings & Structures',
  'Trains & Stations',
  'Cars, Buses & Planes',
  'Boats & Harbours',
  'Coast & Water',
  'Hills & Countryside',
  'Flowers & Wildlife',
  'Objects & Details',
  'Night & Light',
] as const;
type Category = typeof categories[number];
type Colour = 'all' | 'colour' | 'monochrome';
type Format = 'all' | 'portrait' | 'landscape';
type Photograph = typeof photographs[number];

export default function Gallery() {
  const [category, setCategory] = useState<Category>('All work');
  const [colour, setColour] = useState<Colour>('all');
  const [format, setFormat] = useState<Format>('all');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const filtered = useMemo(() => filterPhotographs(photographs, colour, format, category), [category, colour, format]);
  const pages = pageCountFor(filtered.length);
  const shown = photographPage(filtered, page);
  const current = filtered[index] ?? filtered[0];
  const featured = category === 'All work' && colour === 'all' && format === 'all' && page === 0;
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

  function photoCard(photo: Photograph, position: number, isFeatured = false) {
    const absoluteIndex = page * PAGE_SIZE + position;
    return <figure className={'photograph' + (isFeatured ? ' featured-' + position : '')} key={photo.id}>
      <DialogTrigger
        render={<Button variant="ghost" className="photo-button" />}
        onClick={() => { setIndex(absoluteIndex); setLoaded(false); setImageFailed(false); }}
        aria-label={'View ' + photo.title + ' full screen'}
      >
        <img src={BASE_PATH + '/archive/' + photo.id + '-thumb.webp'} alt={photo.alt} width={photo.width} height={photo.height} loading={position < 3 ? 'eager' : 'lazy'} fetchPriority={position === 0 ? 'high' : 'auto'} decoding="async" />
        <span className="photo-open" aria-hidden="true"><Maximize2 size={16} /></span>
      </DialogTrigger>
      <figcaption><span>{photo.title}</span><span>{photo.category}</span></figcaption>
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
        {categories.map(item => <Button key={item} variant="ghost" className="filter-button" aria-pressed={category === item} onClick={() => { setCategory(item); resetCollection(); }}>{item}</Button>)}
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
    {shown.length ? featured ? <>
      <div className="featured-grid">{shown.slice(0, 3).map((photo, position) => photoCard(photo, position, true))}</div>
      <div className="collection-grid">{shown.slice(3).map((photo, position) => photoCard(photo, position + 3))}</div>
    </> : <div className="collection-grid filtered-grid">{shown.map((photo, position) => photoCard(photo, position))}</div> :
      <div className="archive-empty"><p>No photographs match these filters.</p><Button variant="outline" onClick={() => { setColour('all'); setFormat('all'); resetCollection(); }}>Show all photographs</Button></div>}
    <div className="gallery-end archive-end">
      {pagination('bottom')}
      <a className="text-link" href="https://www.instagram.com/hj_nakamura/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a>
    </div>
    {current && <DialogContent className="photo-dialog" showCloseButton={false} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    }}>
      <div className="viewer-header"><span>Hinata Justin Nakamura</span><DialogClose render={<Button variant="ghost" className="viewer-button" />} aria-label="Close photograph"><X size={22} /></DialogClose></div>
      <div className="viewer-image" onTouchStart={event => { if (event.touches.length === 1) touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; else touchStart.current = null; }} onTouchEnd={event => {
        if (!touchStart.current || !event.changedTouches[0]) return;
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}>
        {open && <img key={current.id} src={fullSource(current)} alt={current.alt} width={current.width} height={current.height} onLoad={() => setLoaded(true)} onError={() => { setImageFailed(true); setLoaded(true); }} />}
        {open && !loaded && <span className="viewer-loading" role="status">Loading photograph…</span>}
        {imageFailed && <span className="viewer-loading" role="alert">This photo couldn’t load. Try opening the full-size image below.</span>}
      </div>
      <div className="viewer-footer">
        <div className="viewer-caption" aria-live="polite"><DialogTitle>{current.title}</DialogTitle><DialogDescription>{current.category} · {current.monochrome ? 'Black & white' : 'Colour'} · {current.width.toLocaleString('en-GB')} × {current.height.toLocaleString('en-GB')} px <span className="viewer-hint">— Arrow keys or swipe to explore</span></DialogDescription><a className="original-link" href={fullSource(current)} target="_blank" rel="noreferrer">Open full-size image <ArrowUpRight size={12} /></a></div>
        <div className="viewer-navigation"><Button variant="ghost" className="viewer-button" onClick={() => move(-1)} aria-label="Previous photograph"><ArrowLeft size={22} /></Button><span aria-label={'Photograph ' + (index + 1) + ' of ' + filtered.length}>{index + 1} / {filtered.length.toLocaleString('en-GB')}</span><Button variant="ghost" className="viewer-button" onClick={() => move(1)} aria-label="Next photograph"><ArrowRight size={22} /></Button></div>
      </div>
    </DialogContent>}
  </Dialog>;
}

import { ArrowUpRight } from 'lucide-react';
import Gallery from './gallery';
import photographs from './archive.json';
import type { Category } from './categories';

const basePath = '/photography';
const instagram = 'https://www.instagram.com/hj_nakamura/';

export default function ArchivePage({ initialCategory = 'All work' }: { initialCategory?: Category }) {
  const total = initialCategory === 'All work'
    ? photographs.length
    : photographs.filter(photograph => photograph.category === initialCategory).length;

  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#work">Skip to photographs</a>
      <header className="site-header">
        <a href={`${basePath}/`} className="wordmark" aria-label="Hinata Justin Nakamura — show all work"><h1>Hinata Justin Nakamura</h1></a>
        <nav aria-label="Main navigation"><a href={`${basePath}/`}>Photographs</a><a href={`${basePath}/about`}>About</a><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12} /></a></nav>
      </header>
      <main>
        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="section-bar"><h2 id="work-title">{initialCategory === 'All work' ? 'Archive' : initialCategory}</h2><span>{total.toLocaleString('en-GB')} photographs</span></div>
          <Gallery initialCategory={initialCategory} />
        </section>
      </main>
      <footer><span>© 2026 Hinata Justin Nakamura. All rights reserved.</span><a href={`${basePath}/about`}>About / Contact</a><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={11} /></a><a href="#top">Top ↑</a></footer>
    </div>
  );
}

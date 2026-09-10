import Gallery from './gallery';
import photographs from './archive.json';
import type { Category } from './categories';
import SiteSidebar from './site-sidebar';

const basePath = '/photography';

export default function ArchivePage({ initialCategory = 'All work' }: { initialCategory?: Category }) {
  const total = initialCategory === 'All work'
    ? photographs.filter(photograph => photograph.category !== 'School' && photograph.category !== '25').length
    : photographs.filter(photograph => photograph.category === initialCategory).length;

  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#work">Skip to photographs</a>
      <SiteSidebar basePath={basePath} currentCategory={initialCategory} />
      <div className="site-main-shell">
        <main>
          <section id="work" className="work-section" aria-labelledby="work-title">
            <div className="section-bar"><h2 id="work-title">{initialCategory === 'All work' ? 'All work' : initialCategory}</h2><span>{total.toLocaleString('en-GB')} photographs</span></div>
            <Gallery initialCategory={initialCategory} />
          </section>
        </main>
      </div>
    </div>
  );
}

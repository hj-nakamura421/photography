import { ArrowUpRight } from 'lucide-react';
import { categories, categoryHref, type Category } from './categories';

const instagram = 'https://www.instagram.com/hj_nakamura/';
const projects: Category[] = ['Матрёшка', '25', 'Graffgow'];
const collections = categories.filter(category => category !== 'All work' && category !== 'School' && !projects.includes(category));

export default function SiteSidebar({
  basePath,
  currentCategory,
  currentPage,
}: {
  basePath: string;
  currentCategory?: Category;
  currentPage?: 'about' | 'locations';
}) {
  const categoryLink = (category: Category) => (
    <a
      key={category}
      className="sidebar-link"
      href={categoryHref(category, basePath)}
      aria-current={currentCategory === category ? 'page' : undefined}
    >
      {category}
    </a>
  );

  return (
    <aside className="site-sidebar">
      <a href={`${basePath}/`} className="wordmark" aria-label="Hinata Justin Nakamura — selected work">
        <h1>Hinata Justin Nakamura</h1>
      </a>
      <nav className="sidebar-nav" aria-label="Portfolio navigation">
        <div className="sidebar-group">
          <span className="sidebar-label">Work</span>
          {categoryLink('All work')}
          {categoryLink('School')}
          <a className="sidebar-link" href={`${basePath}/locations`} aria-current={currentPage === 'locations' ? 'page' : undefined}>Locations</a>
        </div>
        <div className="sidebar-group">
          <span className="sidebar-label">Projects</span>
          {projects.map(categoryLink)}
        </div>
        <div className="sidebar-group">
          <span className="sidebar-label">Collections</span>
          {collections.map(categoryLink)}
        </div>
      </nav>
      <div className="sidebar-footer">
        <a className="sidebar-link" href={`${basePath}/about`} aria-current={currentPage === 'about' ? 'page' : undefined}>About</a>
        <a className="sidebar-link" href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={11} /></a>
        <span className="sidebar-copyright">© 2026<br />Hinata Justin Nakamura<br />All rights reserved.</span>
      </div>
    </aside>
  );
}

import { ArrowUpRight } from 'lucide-react';
import Gallery from './gallery';

const instagram = 'https://www.instagram.com/hj_nakamura/';
export const dynamic = 'force-static';

export default function Home() {
  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#work">Skip to photographs</a>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Hinata Justin Nakamura home"><h1>Hinata Justin Nakamura</h1></a>
        <nav aria-label="Main navigation"><a href="#work">Photographs</a><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12} /></a></nav>
      </header>
      <main>
        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="section-bar"><h2 id="work-title">Archive</h2><span>1,054 photographs</span></div>
          <Gallery />
        </section>
      </main>
      <footer><span>© 2026 Hinata Justin Nakamura</span><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={11} /></a><a href="#top">Top ↑</a></footer>
    </div>
  );
}

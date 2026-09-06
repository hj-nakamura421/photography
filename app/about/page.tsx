import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';

const instagram = 'https://www.instagram.com/hj_nakamura/';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'About / Contact — Hinata Justin Nakamura',
  description: 'About and contact details for photographer Hinata Justin Nakamura.',
  alternates: { canonical: 'https://hj-nakamura421.github.io/photography/about' },
};

export default function About() {
  return (
    <div className="site-shell about-shell">
      <header className="site-header">
        <a href="/photography/" className="wordmark" aria-label="Hinata Justin Nakamura home"><h1>Hinata Justin Nakamura</h1></a>
        <nav aria-label="Main navigation"><a href="/photography/">Photographs</a><a href="/photography/about" aria-current="page">About</a><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12} /></a></nav>
      </header>
      <main className="about-main">
        <section className="about-section" aria-labelledby="about-title">
          <h2 id="about-title">About / Contact</h2>
          <div className="about-grid">
            <p className="about-details">Hinata Justin Nakamura<br />London, Edinburgh, Tokyo<br /><a href={instagram} target="_blank" rel="noreferrer">@hj_nakamura <ArrowUpRight size={13} /></a></p>
            <p className="about-statement">Photographer working across street, landscape and documentary photography.</p>
          </div>
        </section>
      </main>
      <footer><span>© 2026 Hinata Justin Nakamura. All rights reserved.</span><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={11} /></a><a href="/photography/">Photographs</a></footer>
    </div>
  );
}

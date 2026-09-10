import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SiteSidebar from '../site-sidebar';

const instagram = 'https://www.instagram.com/hj_nakamura/';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'About — Hinata Justin Nakamura',
  description: 'About and contact details for photographer Hinata Justin Nakamura.',
  alternates: { canonical: 'https://hj-nakamura421.github.io/photography/about' },
};

export default function About() {
  return (
    <div className="site-shell about-shell">
      <SiteSidebar basePath="/photography" currentPage="about" />
      <div className="site-main-shell about-content-shell">
        <main className="about-main">
          <section className="about-section" aria-labelledby="about-title">
            <h2 id="about-title">About</h2>
            <div className="about-grid">
              <p className="about-details">Hinata Justin Nakamura<br />London, Edinburgh, Tokyo<br /><a href={instagram} target="_blank" rel="noreferrer">@hj_nakamura <ArrowUpRight size={13} /></a></p>
              <div className="about-content">
                <p className="about-statement">Photographer working between London, Edinburgh and Tokyo. My work focuses on architecture, transport, landscape and everyday life.</p>
                <div className="about-projects">
                  <h3>Projects</h3>
                  <Link href="/photography/category/matryoshka">Матрёшка</Link>
                  <Link href="/photography/category/25">25</Link>
                  <Link href="/photography/category/graffgow">Graffgow</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

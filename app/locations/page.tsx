import type { Metadata } from 'next';
import LocationExplorer from '../location-explorer';
import SiteSidebar from '../site-sidebar';
import photographs from '../archive.json';

const basePath = '/photography';
const canonical = 'https://hj-nakamura421.github.io/photography/locations';
const visibleLocations = new Set(
  photographs
    .filter(photograph => photograph.location && photograph.category !== 'School' && photograph.category !== '25')
    .map(photograph => photograph.location),
);

export const metadata: Metadata = {
  title: 'Locations — Hinata Justin Nakamura',
  description: 'Explore photographs by Hinata Justin Nakamura on an interactive map.',
  alternates: { canonical },
  openGraph: { title: 'Locations — Hinata Justin Nakamura', description: 'Explore photographs by location.', url: canonical },
  twitter: { title: 'Locations — Hinata Justin Nakamura', description: 'Explore photographs by location.' },
};

export default function LocationsPage() {
  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#locations">Skip to locations</a>
      <SiteSidebar basePath={basePath} currentPage="locations" />
      <div className="site-main-shell">
        <main>
          <section id="locations" className="locations-section" aria-labelledby="locations-title">
            <div className="section-bar"><h2 id="locations-title">Locations</h2><span>{visibleLocations.size} places</span></div>
            <p className="locations-intro">Select a place on the map or in the list to see the photographs made there.</p>
            <LocationExplorer basePath={basePath} />
          </section>
        </main>
      </div>
    </div>
  );
}

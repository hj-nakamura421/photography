import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArchivePage from '../../archive-page';
import { categoriesBySlug } from '../../categories';

const canonicalBase = 'https://hj-nakamura421.github.io/photography';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categoriesBySlug).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoriesBySlug[slug];
  if (!category) return {};
  const title = `${category} — Hinata Justin Nakamura`;
  const description = `${category} photography by Hinata Justin Nakamura.`;
  const url = `${canonicalBase}/category/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoriesBySlug[slug];
  if (!category) notFound();
  return <ArchivePage initialCategory={category} />;
}

export const categories = [
  'All work',
  'Матрёшка',
  '25',
  'School',
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

export type Category = typeof categories[number];

export const categorySlugs: Record<Category, string> = {
  'All work': '',
  'Матрёшка': 'matryoshka',
  '25': '25',
  'School': 'school',
  'People & Street': 'people-street',
  'Buildings & Structures': 'buildings-structures',
  'Trains & Stations': 'trains-stations',
  'Cars, Buses & Planes': 'cars-buses-planes',
  'Boats & Harbours': 'boats-harbours',
  'Coast & Water': 'coast-water',
  'Hills & Countryside': 'hills-countryside',
  'Flowers & Wildlife': 'flowers-wildlife',
  'Objects & Details': 'objects-details',
  'Night & Light': 'night-light',
};

export const categoriesBySlug = Object.fromEntries(
  categories.filter(category => category !== 'All work').map(category => [categorySlugs[category], category]),
) as Record<string, Exclude<Category, 'All work'>>;

export function categoryHref(category: Category, basePath: string) {
  return category === 'All work' ? `${basePath}/` : `${basePath}/category/${categorySlugs[category]}`;
}

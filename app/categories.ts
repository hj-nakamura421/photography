export const categories = [
  'All work',
  'School',
  'Матрёшка',
  '25',
  'Graffgow',
  'People',
  'Still',
  'Rail',
  'Vehicles',
  'Vessels',
  'Water',
  'Hills & Countryside',
  'Flowers & Wildlife',
  'Objects & Details',
  'Night & Light',
] as const;

export type Category = typeof categories[number];
export type PortfolioView = Category | 'Selected work';

export const categorySlugs: Record<Category, string> = {
  'All work': 'all-work',
  'School': 'school',
  'Матрёшка': 'matryoshka',
  '25': '25',
  'Graffgow': 'graffgow',
  'People': 'people',
  'Still': 'still',
  'Rail': 'rail',
  'Vehicles': 'vehicles',
  'Vessels': 'vessels',
  'Water': 'water',
  'Hills & Countryside': 'hills-countryside',
  'Flowers & Wildlife': 'flowers-wildlife',
  'Objects & Details': 'objects-details',
  'Night & Light': 'night-light',
};

export const categoriesBySlug = Object.fromEntries(
  categories.map(category => [categorySlugs[category], category]),
) as Record<string, Category>;

export function categoryHref(category: Category, basePath: string) {
  return `${basePath}/category/${categorySlugs[category]}`;
}

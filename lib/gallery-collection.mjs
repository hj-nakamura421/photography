export const PAGE_SIZE = 36;

/** @template {{category: string, monochrome: boolean, width: number, height: number}} T
 * @param {T[]} photos
 * @param {'all' | 'colour' | 'monochrome'} colour
 * @param {'all' | 'portrait' | 'landscape'} format
 * @param {string} category
 * @returns {T[]} */
export function filterPhotographs(photos, colour = 'all', format = 'all', category = 'All work') {
  return photos.filter(photo =>
    (category === 'All work' || photo.category === category) &&
    (colour === 'all' || (colour === 'monochrome' ? photo.monochrome : !photo.monochrome)) &&
    (format === 'all' || (format === 'portrait' ? photo.height >= photo.width : photo.width > photo.height))
  );
}

/** @param {number} count */
export function pageCountFor(count) { return Math.max(1, Math.ceil(count / PAGE_SIZE)); }

/** @template T @param {T[]} photos @param {number} page @returns {T[]} */
export function photographPage(photos, page) {
  const index = Math.max(0, Math.min(Math.floor(page) || 0, pageCountFor(photos.length) - 1));
  return photos.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE);
}

/** @param {number} current @param {number} delta @param {number} count */
export function nextPhotographIndex(current, delta, count) {
  return count > 0 ? ((current + delta) % count + count) % count : 0;
}

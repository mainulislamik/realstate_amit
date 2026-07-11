export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function uniqueSlug(
  base: string,
  existing: { slug: string }[],
  ignoreSlug?: string,
): string {
  const root = slugify(base) || 'item';
  let slug = root;
  let i = 2;
  while (existing.some((e) => e.slug === slug && e.slug !== ignoreSlug)) {
    slug = `${root}-${i}`;
    i++;
  }
  return slug;
}

import { store } from '../data/store';
import { Property } from '../models/types';

const FILE = 'properties.json';

export const getAllProperties = (): Property[] => store.load<Property>(FILE);
export const getPropertyBySlug = (slug: string) => getAllProperties().find(p => p.slug === slug);
export const getPropertyById = (id: number) => getAllProperties().find(p => p.id === id);
export const getFeatured = () => getAllProperties().filter(p => p.featured);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const nextId = () => {
  const all = getAllProperties();
  return all.length ? Math.max(...all.map(p => p.id)) + 1 : 1;
};

function uniqueSlug(base: string, ignoreId?: number): string {
  let slug = slugify(base) || 'property';
  let i = 2;
  while (getAllProperties().some(p => p.slug === slug && p.id !== ignoreId)) {
    slug = `${slugify(base)}-${i}`;
    i++;
  }
  return slug;
}

export function createProperty(data: Partial<Property>): Property {
  const all = getAllProperties();
  const prop: Property = {
    id: nextId(),
    title: '',
    type: 'Apartment',
    status: 'For Sale',
    price: 0,
    beds: 0,
    baths: 0,
    sqft: 0,
    image: '',
    description: '',
    location: '',
    state: '',
    label: '',
    featured: false,
    slug: '',
    createdAt: new Date().toISOString(),
    ...data,
  } as Property;
  prop.slug = uniqueSlug(prop.title || 'property');
  all.push(prop);
  store.save(FILE, all);
  return prop;
}

export function updateProperty(id: number, data: Partial<Property>): Property | null {
  const all = getAllProperties();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated: Property = { ...all[idx], ...data };
  if (data.title) updated.slug = uniqueSlug(data.title, id);
  all[idx] = updated;
  store.save(FILE, all);
  return updated;
}

export function deleteProperty(id: number): boolean {
  const all = getAllProperties();
  const filtered = all.filter(p => p.id !== id);
  if (filtered.length === all.length) return false;
  store.save(FILE, filtered);
  return true;
}

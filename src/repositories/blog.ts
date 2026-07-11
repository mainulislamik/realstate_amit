import { store } from '../data/store';
import { Post } from '../models/types';

const FILE = 'posts.json';

export const getAllPosts = (): Post[] => store.load<Post>(FILE);
export const getPostBySlug = (slug: string) => getAllPosts().find(p => p.slug === slug);
export const getPostById = (id: number) => getAllPosts().find(p => p.id === id);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const nextId = () => {
  const all = getAllPosts();
  return all.length ? Math.max(...all.map(p => p.id)) + 1 : 1;
};

function today(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function uniqueSlug(base: string, ignoreId?: number): string {
  let slug = slugify(base) || 'post';
  let i = 2;
  while (getAllPosts().some(p => p.slug === slug && p.id !== ignoreId)) {
    slug = `${slugify(base)}-${i}`;
    i++;
  }
  return slug;
}

export function createPost(data: Partial<Post>): Post {
  const all = getAllPosts();
  const post: Post = {
    id: nextId(),
    title: '',
    slug: '',
    category: 'General',
    date: today(),
    image: '',
    excerpt: '',
    content: '',
    ...data,
  } as Post;
  post.slug = uniqueSlug(post.title || 'post');
  all.push(post);
  store.save(FILE, all);
  return post;
}

export function updatePost(id: number, data: Partial<Post>): Post | null {
  const all = getAllPosts();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated: Post = { ...all[idx], ...data };
  if (data.title) updated.slug = uniqueSlug(data.title, id);
  all[idx] = updated;
  store.save(FILE, all);
  return updated;
}

export function deletePost(id: number): boolean {
  const all = getAllPosts();
  const filtered = all.filter(p => p.id !== id);
  if (filtered.length === all.length) return false;
  store.save(FILE, filtered);
  return true;
}

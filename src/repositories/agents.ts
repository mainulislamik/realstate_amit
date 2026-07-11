import { store } from '../data/store';
import { Agent } from '../models/types';

const FILE = 'agents.json';

export const getAllAgents = (): Agent[] => store.load<Agent>(FILE);
export const getAgentBySlug = (slug: string) => getAllAgents().find(a => a.slug === slug);
export const getAgentById = (id: number) => getAllAgents().find(a => a.id === id);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const nextId = () => {
  const all = getAllAgents();
  return all.length ? Math.max(...all.map(a => a.id)) + 1 : 1;
};

function uniqueSlug(base: string, ignoreId?: number): string {
  let slug = slugify(base) || 'agent';
  let i = 2;
  while (getAllAgents().some(a => a.slug === slug && a.id !== ignoreId)) {
    slug = `${slugify(base)}-${i}`;
    i++;
  }
  return slug;
}

export function createAgent(data: Partial<Agent>): Agent {
  const all = getAllAgents();
  const agent: Agent = {
    id: nextId(),
    name: '',
    slug: '',
    phone: '',
    phone2: '',
    whatsapp: '',
    email: '',
    image: '',
    title: '',
    bio: '',
    verified: false,
    listings: [],
    ...data,
  } as Agent;
  agent.slug = uniqueSlug(agent.name || 'agent');
  all.push(agent);
  store.save(FILE, all);
  return agent;
}

export function updateAgent(id: number, data: Partial<Agent>): Agent | null {
  const all = getAllAgents();
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const updated: Agent = { ...all[idx], ...data };
  if (data.name) updated.slug = uniqueSlug(data.name, id);
  all[idx] = updated;
  store.save(FILE, all);
  return updated;
}

export function deleteAgent(id: number): boolean {
  const all = getAllAgents();
  const filtered = all.filter(a => a.id !== id);
  if (filtered.length === all.length) return false;
  store.save(FILE, filtered);
  return true;
}

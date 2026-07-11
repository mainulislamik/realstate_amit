import bcrypt from 'bcryptjs';
import { store } from '../data/store';
import { User } from '../models/types';

const FILE = 'users.json';

export const getAllUsers = (): User[] => store.load<User>(FILE);
export const findByUsername = (username: string) => getAllUsers().find(u => u.username === username);
export const findById = (id: number) => getAllUsers().find(u => u.id === id);

export function ensureAdmin(): void {
  const users = getAllUsers();
  if (users.length === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = bcrypt.hashSync(password, 10);
    const user: User = { id: 1, username, password: hash, role: 'admin' };
    store.save(FILE, [user]);
    console.log(`\n========================================`);
    console.log(`  Admin user created`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Login at: /admin/login`);
    console.log(`========================================\n`);
  }
}

export function verify(username: string, password: string): User | null {
  const user = findByUsername(username);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password)) return null;
  return user;
}

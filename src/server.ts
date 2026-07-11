import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import indexRoutes from './routes/index';
import propertiesRoutes from './routes/properties';
import agentsRoutes from './routes/agents';
import blogRoutes from './routes/blog';
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import { ensureAdmin } from './repositories/users';
import { store } from './data/store';

const app = express();
const PORT = process.env.PORT || 3000;

const SEEDS_DIR = process.env.SEEDS_DIR || path.join(__dirname, '..', '..', 'seeds');
['properties.json', 'agents.json', 'posts.json', 'users.json'].forEach(f => {
  const target = path.join(store.dataDir, f);
  const src = path.join(SEEDS_DIR, f);
  if (!fs.existsSync(target) && fs.existsSync(src)) fs.copyFileSync(src, target);
});

ensureAdmin();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'express-realty-prime-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

app.use('/', indexRoutes);
app.use('/properties', propertiesRoutes);
app.use('/agents', agentsRoutes);
app.use('/blog', blogRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', currentPage: '' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

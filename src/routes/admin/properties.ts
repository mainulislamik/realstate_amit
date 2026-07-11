import { Router, Request, Response } from 'express';
import { upload } from '../../middleware/upload';
import {
  getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty,
} from '../../repositories/properties';

const router = Router();
const TYPES = ['Apartment', 'Villa', 'Studio', 'Office', 'Shop', 'Single Family Home', 'Penthouse', 'Townhouse', 'Land'];
const STATUSES = ['For Sale', 'For Rent', 'Sold'];

router.get('/', (req: Request, res: Response) => {
  res.render('admin/properties', {
    title: 'Manage Properties',
    properties: getAllProperties(),
    types: TYPES,
    statuses: STATUSES,
  });
});

router.get('/new', (req: Request, res: Response) => {
  res.render('admin/property-form', { title: 'New Property', property: null, types: TYPES, statuses: STATUSES });
});

router.post('/', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  createProperty({
    title: b.title,
    type: b.type,
    status: b.status,
    price: Number(b.price) || 0,
    beds: Number(b.beds) || 0,
    baths: Number(b.baths) || 0,
    sqft: Number(b.sqft) || 0,
    label: b.label || '',
    location: b.location,
    state: b.state,
    description: b.description,
    image: req.file ? `/uploads/${req.file.filename}` : (b.image || ''),
    featured: b.featured === 'on',
  });
  res.redirect('/admin/properties');
});

router.get('/:id/edit', (req: Request, res: Response) => {
  const property = getPropertyById(Number(req.params.id));
  if (!property) return res.redirect('/admin/properties');
  res.render('admin/property-form', { title: 'Edit Property', property, types: TYPES, statuses: STATUSES });
});

router.post('/:id', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  const data: any = {
    title: b.title,
    type: b.type,
    status: b.status,
    price: Number(b.price) || 0,
    beds: Number(b.beds) || 0,
    baths: Number(b.baths) || 0,
    sqft: Number(b.sqft) || 0,
    label: b.label || '',
    location: b.location,
    state: b.state,
    description: b.description,
    featured: b.featured === 'on',
  };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (b.image) data.image = b.image;
  updateProperty(Number(req.params.id), data);
  res.redirect('/admin/properties');
});

router.post('/:id/delete', (req: Request, res: Response) => {
  deleteProperty(Number(req.params.id));
  res.redirect('/admin/properties');
});

export default router;

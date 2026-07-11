export interface Property {
  id: number;
  title: string;
  slug: string;
  price: number;
  type: string;
  status: string;
  label: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  description: string;
  location: string;
  state: string;
  featured: boolean;
  createdAt: string;
}

export interface Agent {
  id: number;
  name: string;
  slug: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  image: string;
  title: string;
  bio: string;
  verified: boolean;
  listings: number[];
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

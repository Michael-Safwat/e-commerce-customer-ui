
import { Product } from '../types/product';

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports & Outdoors' }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    price: 299,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Premium wireless headphones with noise cancellation',
    colors: ['Black', 'White', 'Silver'],
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '2',
    name: 'Minimalist Watch',
    price: 199,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'accessories',
    description: 'Elegant minimalist watch with leather strap',
    colors: ['Brown', 'Black'],
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '3',
    name: 'Premium T-Shirt',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing',
    description: 'Soft cotton t-shirt with perfect fit',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 89,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Adjustable aluminum laptop stand',
    colors: ['Silver', 'Space Gray'],
    inStock: true,
    rating: 4.7,
    reviews: 67
  },
  {
    id: '5',
    name: 'Ceramic Plant Pot',
    price: 45,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Modern ceramic plant pot with drainage',
    colors: ['White', 'Terracotta', 'Black'],
    inStock: true,
    rating: 4.3,
    reviews: 45
  },
  {
    id: '6',
    name: 'Running Shoes',
    price: 159,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'sports',
    description: 'Lightweight running shoes with superior comfort',
    colors: ['White', 'Black', 'Blue'],
    sizes: ['7', '8', '9', '10', '11'],
    inStock: true,
    rating: 4.6,
    reviews: 123
  }
];

import { Product } from '../types/product';

export type SavedProduct = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  [key: string]: any;
};

let savedItems: SavedProduct[] = [];

export async function fetchSavedList(): Promise<SavedProduct[]> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 500));
  return [...savedItems];
}

export async function removeFromSavedList(id: string): Promise<void> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 200));
  savedItems = savedItems.filter(item => item.id !== id);
}

export async function addToSavedList(product: Product): Promise<void> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 200));
  // Prevent duplicates
  if (!savedItems.find(item => item.id === product.id)) {
    savedItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }
}
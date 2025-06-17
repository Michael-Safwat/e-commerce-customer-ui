export type SavedItem = {
  id: string;
  name: string;
  price: number;
};

let savedItems: SavedItem[] = [
  { id: '1', name: 'Apple AirPods Pro', price: 249.99 },
  { id: '2', name: 'iPhone 15 Case', price: 49.99 },
];

export async function fetchSavedList(): Promise<SavedItem[]> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 500));
  return [...savedItems];
}

export async function removeFromSavedList(id: string): Promise<void> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 200));
  savedItems = savedItems.filter(item => item.id !== id);
}
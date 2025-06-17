export type SavedItem = {
  id: string;
  name: string;
  price: number;
};

export async function fetchSavedList(): Promise<SavedItem[]> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 500));
  // Dummy data
  return [
    { id: '1', name: 'Apple AirPods Pro', price: 249.99 },
    { id: '2', name: 'iPhone 15 Case', price: 49.99 },
  ];
}
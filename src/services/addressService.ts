export interface Address {
  id: number;
  label: string;
}

// Simulate fetching addresses from an API
export const fetchAddresses = async (): Promise<Address[]> => {
  // In a real app, replace this with an API call, e.g.:
  // return fetch('/api/addresses').then(res => res.json());
  return [
    { id: 1, label: '123 Main St, City, Country' },
    { id: 2, label: '456 Elm St, City, Country' },
  ];
};
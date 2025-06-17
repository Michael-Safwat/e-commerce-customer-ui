import React, { useEffect, useState } from 'react';
import { fetchSavedList, SavedItem } from '../services/savedListService';

const SavedList: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedList().then((items) => {
      setSavedItems(items);
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Saved List</h2>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : savedItems.length === 0 ? (
        <div className="text-gray-600">No saved items yet.</div>
      ) : (
        <ul className="space-y-2">
          {savedItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b pb-2">
              <span>{item.name}</span>
              <span className="font-semibold">${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SavedList;
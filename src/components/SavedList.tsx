import React, { useEffect, useState } from 'react';
import { fetchSavedList, removeFromSavedList, SavedItem } from '../services/savedListService';
import { Trash2 } from 'lucide-react'; // or 'react-icons/fi' for FiTrash2, or any icon library you use

const SavedList: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedList().then((items) => {
      setSavedItems(items);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    await removeFromSavedList(id);
    const updated = await fetchSavedList();
    setSavedItems(updated);
    setRemovingId(null);
  };

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
              <span className="flex items-center gap-2">
                <span className="font-semibold">${item.price.toFixed(2)}</span>
                <button
                  className="text-red-600 hover:text-red-800 p-1"
                  onClick={() => handleRemove(String(item.id))}
                  disabled={removingId === item.id}
                  title="Remove"
                >
                  {removingId === item.id ? (
                    <svg className="animate-spin h-5 w-5 text-red-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SavedList;
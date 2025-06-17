import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const BasicInfoManager: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save logic (API call or context update)
    setMessage('Profile updated!');
    setShowModal(false);
  };

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
      <div className="flex items-center gap-6">
        <img
          src={profileImage || '/default-profile.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-medium">{user?.name || 'Your Name'}</div>
          <div className="text-gray-600">{user?.email}</div>
          <div className="text-gray-500 text-sm">Birthday: {user?.birthday || 'Not set'}</div>
        </div>
        <button
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition"
          onClick={() => setShowModal(true)}
          type="button"
        >
          Edit
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
              type="button"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Basic Information</h3>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="birthday">Birthday</label>
                <input
                  id="birthday"
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="profileImage">Profile Image URL</label>
                <input
                  id="profileImage"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition"
              >
                Save
              </button>
              {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BasicInfoManager;
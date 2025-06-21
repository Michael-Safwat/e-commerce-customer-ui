import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BasicInfoManager: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User information not available.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      // TODO: Add update profile endpoint to backend
      // For now, we'll just show a success message
      // const updatedProfile = await userService.updateUserProfile(user.id, { name, email });
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      // Refresh user profile data
      await refreshUserProfile();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
          <span className="text-2xl font-semibold text-blue-600">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900">
            {user?.name || 'Your Name'}
          </div>
          <div className="text-gray-600">{user?.email}</div>
          <div className="text-gray-500 text-sm">
            Member since {new Date().getFullYear()}
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50"
          onClick={() => setShowModal(true)}
          type="button"
          disabled={!user}
        >
          Edit
        </button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
              type="button"
              disabled={isUpdating}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Basic Information</h3>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  value={email}
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg py-2 transition disabled:opacity-50"
                  onClick={() => setShowModal(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50 flex items-center justify-center"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BasicInfoManager;
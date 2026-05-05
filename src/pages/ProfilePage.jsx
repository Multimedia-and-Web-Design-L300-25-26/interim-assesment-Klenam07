import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { API_URL } from '../config';
import Footer from '../components/footer';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Not authenticated, redirect to sign in
        navigate('/signin');
      } else {
        setError('Failed to load profile');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/signin');
    } catch {
      console.error('Logout error');
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

          {user && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <p className="text-white">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <p className="text-white">{user.accountType || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Since
                </label>
                <p className="text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
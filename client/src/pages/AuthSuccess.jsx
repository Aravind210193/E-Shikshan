import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthSuccess = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token and mark as logged in
      localStorage.setItem('token', token);
      
      // Fetch user profile to store user data
      const fetchUserProfile = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'https://e-shikshan.onrender.com/api';
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoggedIn(true);
            toast.success('Successfully signed in with Google!');
            navigate('/profile');
          } else {
            throw new Error('Failed to fetch profile');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Authentication successful but failed to load profile. Please try logging in again.');
          navigate('/login');
        }
      };

      fetchUserProfile();
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
    }
  }, [searchParams, navigate, setIsLoggedIn]);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Completing Sign In...</h2>
        <p className="text-gray-400">Please wait while we set up your account</p>
      </div>
    </div>
  );
};

export default AuthSuccess;

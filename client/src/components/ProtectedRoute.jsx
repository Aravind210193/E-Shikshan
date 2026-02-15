import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  const [showToast, setShowToast] = useState(false);
  
  // Check both state and localStorage
  const token = localStorage.getItem('token');
  const hasAccess = isLoggedIn || token;

  useEffect(() => {
    if (!hasAccess && !showToast) {
      toast.error('Please login to access this page');
      setShowToast(true);
    }
  }, [hasAccess, showToast]);

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

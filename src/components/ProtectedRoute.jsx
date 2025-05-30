import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexte/AuthContext';
import NProgress from 'nprogress';

export const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    NProgress.start();
    return null;
  }
  
  NProgress.done();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

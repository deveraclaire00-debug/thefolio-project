// frontend/src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage:
// <ProtectedRoute> → requires any logged-in user
// <ProtectedRoute role='admin'> → requires admin role
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) return <Navigate to='/login' replace />;

  // If a role is specified and user doesn't match, redirect to home
  if (role && user.role !== role) return <Navigate to='/' replace />;

  // Otherwise, render the children
  return children;
};

export default ProtectedRoute;
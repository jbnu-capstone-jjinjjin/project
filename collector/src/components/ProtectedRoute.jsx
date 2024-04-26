// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (!user || error) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;

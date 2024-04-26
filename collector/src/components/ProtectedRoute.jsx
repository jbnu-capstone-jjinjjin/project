import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, loading, error, children }) => {
  console.log("ProtectedRoute: User:", user, "Loading:", loading, "Error:", error);

  if (loading) return <div>Loading...</div>;
  if (!user || error) {
    console.log("Redirecting to login");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 
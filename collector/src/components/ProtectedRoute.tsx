import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';

type ProtectedRouteProps = {
  user: User | null | undefined;
  children: ReactNode;
  loading: boolean;
  error: Error | undefined;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user,loading,error,children }) => {
  if(loading) return <>Loading ...</> ;
  if (!user || error) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

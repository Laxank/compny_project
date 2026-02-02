import React from 'react';
import { Navigate } from 'react-router-dom';
import auth from '../services/auth';

export default function ProtectedRoute({ children }) {
  const user = auth.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
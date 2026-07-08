import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../../pages/LoadingScreen';

export const ProtectedRoute = ({ children }) => {
  const { userProfile, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen error={error} />;
  }

  if (!userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if not complete and trying to access student pages
  if (!userProfile.onboardingComplete && location.pathname.startsWith('/student')) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If onboarding is complete, but trying to access onboarding again, redirect to dashboard
  if (userProfile.onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/student" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { userProfile, isAdmin, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen error={error} />;
  }

  if (!userProfile || !isAdmin) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

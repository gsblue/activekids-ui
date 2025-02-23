import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import FamilyConfig from './components/Family/FamilyConfig';
import Events from './components/Events/Events';
import EventCategories from './components/Events/EventCategories';
import EventForm from './components/Events/EventForm';
import ChildProfile from './components/Child/ChildProfile';
import Analytics from './components/Analytics/Analytics';
import Layout from './components/layout/Layout';
import { RootState } from './store';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { children } = useSelector((state: RootState) => state.family);

  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children: routeChildren }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (children.length === 0 && window.location.pathname !== '/family/config') {
      return <Navigate to="/family/config" replace />;
    }

    return <Layout>{routeChildren}</Layout>;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/config"
          element={
            <ProtectedRoute>
              <FamilyConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id"
          element={
            <ProtectedRoute>
              <ChildProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/categories"
          element={
            <ProtectedRoute>
              <EventCategories />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 
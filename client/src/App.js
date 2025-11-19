import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import PublicProfilePage from './pages/PublicProfilePage';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/directory"
            element={
              <PrivateRoute>
                <AlumniDirectoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <PublicProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </div>
    </>
  );
};

export default App;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Top navigation bar with brand and auth-aware links.
 */
const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/">College Alumni Network</Link>
      </div>
      <nav className="navbar__links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/directory">Alumni Directory</Link>
            <button className="btn btn--link" onClick={handleLogout}>
              Logout {user?.fullName ? `(${user.fullName.split(' ')[0]})` : ''}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

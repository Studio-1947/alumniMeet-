import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMe } from '../api/userApi';

/**
 * Dashboard gives a quick snapshot of the logged-in user's profile.
 */
const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the freshest profile so data is always up to date
    const loadProfile = async () => {
      try {
        const { data } = await fetchMe();
        setUser(data.user);
      } catch (err) {
        setError('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [setUser]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="form-card">
      <h2>Hi, {user?.fullName}</h2>
      <p className="muted">Welcome back to the College Alumni Network.</p>
      <div className="card" style={{ cursor: 'default' }}>
        <div className="card__content">
          <p>
            <strong>Department:</strong> {user?.department}
          </p>
          <p>
            <strong>Batch:</strong> {user?.batchYear}
          </p>
          <p>
            <strong>Status:</strong> {user?.currentStatus}
          </p>
          <p>
            <strong>Role:</strong> {user?.currentRole || 'Not specified'}
          </p>
          <p>
            <strong>Organization:</strong> {user?.currentOrganization || 'Not specified'}
          </p>
          <p>
            <strong>Location:</strong> {user?.location || 'Not specified'}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/edit-profile" className="btn">
          Edit Profile
        </Link>
        <Link to="/directory" className="btn" style={{ background: '#0f766e', borderColor: '#0f766e' }}>
          Browse Alumni
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;

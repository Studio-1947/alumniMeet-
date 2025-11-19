import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../api/userApi';

/**
 * Shows the public-facing profile for a single alumni.
 */
const PublicProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await fetchUserById(id);
        setUser(data.user);
      } catch (err) {
        setError('Unable to load this alumni profile');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p>Profile not found.</p>;

  return (
    <div className="form-card">
      <h2>{user.fullName}</h2>
      <p className="muted">
        {user.department} • Batch {user.batchYear} • {user.currentStatus}
      </p>
      {user.shortBio && <p style={{ lineHeight: 1.6 }}>{user.shortBio}</p>}
      <div className="card" style={{ cursor: 'default' }}>
        <div className="card__content">
          <p>
            <strong>Role:</strong> {user.currentRole || 'Not specified'}
          </p>
          <p>
            <strong>Organization:</strong> {user.currentOrganization || 'Not specified'}
          </p>
          <p>
            <strong>Location:</strong> {user.location || 'Not specified'}
          </p>
          <p>
            <strong>Skills:</strong> {user.skills?.length ? user.skills.join(', ') : 'Not added yet'}
          </p>
          <p>
            <strong>LinkedIn:</strong>{' '}
            {user.linkedinUrl ? (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer">
                View profile
              </a>
            ) : (
              'Not added'
            )}
          </p>
          <p>
            <strong>Portfolio:</strong>{' '}
            {user.portfolioUrl ? (
              <a href={user.portfolioUrl} target="_blank" rel="noreferrer">
                View site
              </a>
            ) : (
              'Not added'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;

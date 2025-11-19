import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Small card used in the alumni directory listing.
 */
const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const initials = user.fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card" onClick={() => navigate(`/profile/${user._id}`)}>
      <div className="card__avatar">{initials || '?'}</div>
      <div className="card__content">
        <h3>{user.fullName}</h3>
        <p>
          Batch {user.batchYear} • {user.department}
        </p>
        <p>
          {user.currentRole || 'Role not specified'} at {user.currentOrganization || 'N/A'}
        </p>
        <p>{user.location || 'Location not specified'}</p>
      </div>
    </div>
  );
};

export default UserCard;

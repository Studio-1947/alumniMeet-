import React, { useEffect, useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import UserCard from '../components/UserCard';
import { fetchUsers } from '../api/userApi';

/**
 * Paginated alumni directory with searching/filtering.
 */
const AlumniDirectoryPage = () => {
  const [filters, setFilters] = useState({ q: '', department: '', batchYear: '', currentStatus: '' });
  const [alumni, setAlumni] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlumni = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchUsers({ ...filters, page, limit: 8 });
        setAlumni(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load alumni. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadAlumni();
  }, [filters, page]);

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div>
      <h2>Alumni Directory</h2>
      <p className="muted">Search, filter, and explore fellow alumni.</p>
      <SearchFilterBar filters={filters} onChange={setFilters} onSearch={handleSearch} />
      {loading && <p>Loading alumni...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && alumni.length === 0 && <p>No alumni found.</p>}
      {alumni.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn"
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlumniDirectoryPage;

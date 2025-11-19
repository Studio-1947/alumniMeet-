import React from 'react';

/**
 * Search and filter controls for the alumni directory.
 */
const SearchFilterBar = ({ filters, onChange, onSearch }) => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        type="text"
        name="q"
        placeholder="Search by name, role, organization, location"
        value={filters.q || ''}
        onChange={handleInput}
      />
      <input
        type="number"
        name="batchYear"
        placeholder="Batch Year"
        value={filters.batchYear || ''}
        onChange={handleInput}
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={filters.department || ''}
        onChange={handleInput}
      />
      <select name="currentStatus" value={filters.currentStatus || ''} onChange={handleInput}>
        <option value="">All Statuses</option>
        <option value="Working">Working</option>
        <option value="Higher Studies">Higher Studies</option>
        <option value="Entrepreneur">Entrepreneur</option>
        <option value="Looking for opportunities">Looking for opportunities</option>
      </select>
      <button type="submit" className="btn">
        Search
      </button>
    </form>
  );
};

export default SearchFilterBar;

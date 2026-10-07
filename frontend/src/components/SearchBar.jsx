import React from 'react';

const categories = ['All', 'Electronics', 'Fashion', 'Books', 'Home'];

const SearchBar = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <select
        className="search-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === 'All' ? 'All Categories' : cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;

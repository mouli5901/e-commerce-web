import React from 'react';

const categories = ['All', 'Electronics', 'Fashion', 'Books', 'Home'];

const SearchBar = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="flex flex-col sm:flex-row mb-4 gap-2">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border rounded px-2 py-1"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
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

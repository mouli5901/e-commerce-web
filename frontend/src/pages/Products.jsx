import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (category && category !== 'All') query.append('category', category);
      const res = await API.get(`/products${query.toString() ? `?${query}` : ''}`);
      setProducts(res.data.products);
    } catch {
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <h1>All <span>Products</span></h1>
        <p>Discover thousands of products curated just for you.</p>
      </div>

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {/* States */}
      {loading && (
        <div className="state-container">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p className="state-text">Loading products…</p>
        </div>
      )}

      {error && (
        <div className="state-container">
          <span className="state-icon">⚠️</span>
          <p className="state-title">Oops</p>
          <p className="state-text">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <span className="state-icon">🔍</span>
          <p className="state-title">No products found</p>
          <p className="state-text">Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

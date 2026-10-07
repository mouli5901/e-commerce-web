import React, { useState, useEffect } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = ["All", "Electronics", "Fashion", "Footwear"];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category && category !== "All") query.append("category", category);
      const res = await API.get(`/products${query.toString() ? `?${query}` : ""}`);
      setProducts(res.data.products || []);
    } catch {
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  // Client-side sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <span className="products-eyebrow">THE ARCHIVE</span>
        <h1 className="products-title">ALL PRODUCTS</h1>
        <p className="products-subtext">
          Browse our full collection of premium engineered goods.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="products-toolbar">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        <div className="products-filter-controls">
          <div className="category-chips-reel" role="tablist" aria-label="Filter categories">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`category-chip ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="products-sort-wrapper">
            <label htmlFor="product-sort" className="sort-label">Sort by:</label>
            <select
              id="product-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <div className="products-results-count">
          Showing <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? "product" : "products"}
          {category !== "All" && ` in ${category}`}
          {search && ` matching "${search}"`}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="state-container">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p className="state-text">Loading catalog…</p>
        </div>
      )}

      {error && (
        <div className="state-container">
          <span className="state-icon">⚠️</span>
          <p className="state-title">Unable to retrieve products</p>
          <p className="state-text">{error}</p>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && sortedProducts.length === 0 && (
        <div className="state-container">
          <span className="state-icon">🔍</span>
          <p className="state-title">No matching products found</p>
          <p className="state-text">Try adjusting your filters or search keywords.</p>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && sortedProducts.length > 0 && (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

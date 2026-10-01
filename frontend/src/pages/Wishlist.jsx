import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/wishlist");
      if (res.data && res.data.success) {
        setWishlist(res.data.wishlist);
      } else {
        setError(res.data.message || "Failed to load wishlist.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/wishlist/${productId}`);
      if (res.data && res.data.success) {
        // Refresh list
        fetchWishlist();
      } else {
        alert(res.data.message || "Failed to remove product.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error removing product.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading your wishlist...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p>Something went wrong.</p>
        <p>{error}</p>
        <button onClick={fetchWishlist} className="mt-4 bg-indigo-600 text-white py-1 px-3 rounded">
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && wishlist.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-3xl mb-4">❤️</p>
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="mb-4">Save products you love and find them here later.</p>
        <Link to="/products" className="bg-indigo-600 text-white py-1 px-3 rounded">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
      <p className="mb-4">{wishlist.length} product{wishlist.length > 1 ? "s" : ""} saved</p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

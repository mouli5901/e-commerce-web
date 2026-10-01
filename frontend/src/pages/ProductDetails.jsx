import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState('idle'); // idle, loading, success, error
  const [wishlistError, setWishlistError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data && res.data.product ? res.data.product : res.data;
        if (data && data._id) {
          setProduct(data);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToWishlist = async () => {
    if (!product) return;
    if (wishlistStatus === 'loading') return;
    setWishlistStatus('loading');
    setWishlistError('');
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data && res.data.success) {
        setWishlistStatus('success');
      } else {
        setWishlistStatus('error');
        setWishlistError(res.data.message || 'Unable to add to wishlist');
      }
    } catch (err) {
      console.error(err);
      setWishlistStatus('error');
      setWishlistError(err.response?.data?.message || 'Unable to add to wishlist');
    }
  };

  const renderWishlistButton = () => {
    switch (wishlistStatus) {
      case 'loading':
        return <button disabled className="bg-gray-300 text-gray-700 py-1 px-3 rounded mt-2">⏳ Saving...</button>;
      case 'success':
        return <button disabled className="bg-pink-500 text-white py-1 px-3 rounded mt-2">♥ Added to Wishlist</button>;
      case 'error':
        return <button onClick={addToWishlist} className="bg-red-500 text-white py-1 px-3 rounded mt-2">♡ Add to Wishlist</button>;
      default:
        return <button onClick={addToWishlist} className="bg-indigo-600 text-white py-1 px-3 rounded mt-2">♡ Add to Wishlist</button>;
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product data.</p>;

  return (
    <div className="container mx-auto p-4">
      <img src={product.image} alt={product.name} className="w-full max-w-md mx-auto" />
      <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-indigo-600 font-bold mt-2">₹{product.price}</p>
      <p className="mt-1">Category: {product.category}</p>
      <p className="mt-1">Stock: {product.stock}</p>
      <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
        Add to Cart
      </button>
      {renderWishlistButton()}
      {wishlistError && <p className="text-red-600 mt-1">{wishlistError}</p>}
    </div>
  );
};

export default ProductDetails;

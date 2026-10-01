import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [wishlistStatus, setWishlistStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleDetails = () => {
    navigate(`/products/${product._id}`);
  };

  const addToWishlist = async () => {
    if (wishlistStatus === 'loading') return;
    setWishlistStatus('loading');
    setErrorMessage('');
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data && res.data.success) {
        setWishlistStatus('success');
      } else {
        setWishlistStatus('error');
        setErrorMessage(res.data.message || 'Unable to save product.');
      }
    } catch (err) {
      console.error(err);
      setWishlistStatus('error');
      setErrorMessage(err.response?.data?.message || 'Unable to save product.');
    }
  };

  const renderWishlistButton = () => {
    switch (wishlistStatus) {
      case 'loading':
        return <button disabled className="bg-gray-300 text-gray-700 py-1 px-3 rounded">⏳ Saving...</button>;
      case 'success':
        return <button disabled className="bg-pink-500 text-white py-1 px-3 rounded">♥ Added to Wishlist</button>;
      case 'error':
        return <button onClick={addToWishlist} className="bg-red-500 text-white py-1 px-3 rounded">♡ Add to Wishlist</button>;
      default:
        return <button onClick={addToWishlist} className="bg-indigo-600 text-white py-1 px-3 rounded">♡ Add to Wishlist</button>;
    }
  };

  return (
    <div className="border rounded shadow p-4 flex flex-col">
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover mb-2" />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-600 mb-1">{product.category}</p>
      <p className="text-indigo-600 font-bold mb-1">₹{product.price}</p>
      <p className="text-sm mb-2">{product.stock} units left</p>
      <div className="mt-auto flex space-x-2">
        {renderWishlistButton()}
        <button onClick={handleDetails} className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700">
          View Details
        </button>
      </div>
      {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
    </div>
  );
};

export default ProductCard;

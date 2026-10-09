import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const normalizeCartItem = (item) => {
    const product = item.product || {};
    const prodId = product._id || item.id || item._id;
    const price = Number(product.price || item.price || 0);
    const originalPrice = product.originalPrice || Math.round(price * 1.25);
    const discount =
      product.discount ||
      Math.round((((originalPrice - price) / (originalPrice || 1)) * 100));

    return {
      _id: item._id || prodId,
      product: product,
      id: prodId,
      name: product.name || item.name || "Product",
      price,
      originalPrice,
      discount,
      image: product.image || item.image || "",
      category: product.category || item.category || "",
      stock: product.stock !== undefined ? product.stock : (item.stock !== undefined ? item.stock : 10),
      quantity: Number(item.quantity) || 1,
      variant: item.variant || "Standard",
    };
  };

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/cart");
      if (res.data && res.data.success) {
        const items = (res.data.cart || []).map(normalizeCartItem);
        setCart(items);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Not authenticated, cart is empty
        setCart([]);
      } else {
        setError("Unable to load your cart.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productOrId, quantity = 1) => {
    const prodId =
      typeof productOrId === "object"
        ? productOrId._id || productOrId.id
        : productOrId;

    try {
      const res = await API.post(`/cart/${prodId}`);
      if (res.data && res.data.success) {
        const items = (res.data.cart || []).map(normalizeCartItem);
        setCart(items);
        showToast("Added to cart!");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, arg2, arg3) => {
    const newQty =
      typeof arg2 === "number"
        ? arg2
        : typeof arg3 === "number"
        ? arg3
        : Number(arg2);

    if (isNaN(newQty) || newQty < 1) return;
    try {
      const res = await API.patch(`/cart/${productId}`, { quantity: Number(newQty) });
      if (res.data && res.data.success) {
        const items = (res.data.cart || []).map(normalizeCartItem);
        setCart(items);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update quantity";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`);
      if (res.data && res.data.success) {
        const items = (res.data.cart || []).map(normalizeCartItem);
        setCart(items);
        showToast("Item removed from cart", "info");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove item";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Derived Values
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 499;
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal + shippingFee;
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        loading,
        cartLoading: loading,
        error,
        cartError: error,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        clearCart,
        totalCount,
        subtotal,
        shippingFee,
        total,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

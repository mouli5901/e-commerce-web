import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "shopkart_cart_v1";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const addToCart = (product, quantity = 1, variant = "Standard") => {
    const qty = Math.max(1, Number(quantity) || 1);
    const prodId = product._id || product.id;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === prodId && item.variant === variant
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const originalPrice =
          product.originalPrice || Math.round(product.price * 1.25);
        const discount =
          product.discount ||
          Math.round(((originalPrice - product.price) / originalPrice) * 100);

        return [
          ...prevCart,
          {
            id: prodId,
            name: product.name,
            price: Number(product.price),
            originalPrice,
            discount,
            image: product.image,
            category: product.category,
            rating: product.rating || 4.7,
            reviewsCount: product.reviewsCount || 128,
            quantity: qty,
            variant,
            stock: product.stock !== undefined ? product.stock : 25,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id, variant = "Standard") => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.variant === variant)));
    showToast("Item removed from cart", "info");
  };

  const updateQuantity = (id, variant, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.variant === variant) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

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
        addToCart,
        removeFromCart,
        updateQuantity,
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

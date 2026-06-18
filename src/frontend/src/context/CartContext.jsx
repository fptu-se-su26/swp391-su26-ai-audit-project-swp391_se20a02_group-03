import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null); // Keep the full API response for totals

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success || res.statusCode === 200) {
        const data = res.data || res;
        setCartItems(data.items || []);
        setCartCount(data.totalItems || data.items?.length || 0);
        setCartData(data);
        localStorage.setItem('cartItems', JSON.stringify(data.items || []));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartData(null);
      localStorage.removeItem('cartItems');
    }
  }, [user]);

  // Sync cartCount whenever cartItems change
  useEffect(() => {
    setCartCount(cartItems.length);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (equipmentId, quantity, bookingId = null) => {
    if (!user) return { success: false, message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' };
    try {
      const res = await cartApi.addToCart({ equipmentId, quantity, bookingId });
      if (res.success || res.statusCode === 200) {
        await fetchCart();
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
      }
      return { success: false, message: res.message || 'Có lỗi xảy ra' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi kết nối' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await cartApi.updateQuantity(cartItemId, quantity);
      if (res.success || res.statusCode === 200) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await cartApi.removeItem(cartItemId);
      if (res.success || res.statusCode === 200) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clearCart();
      if (res.success || res.statusCode === 200) {
        setCartItems([]);
        setCartCount(0);
        setCartData(null);
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCart = () => {
    return { items: cartItems, ...cartData };
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      cartData,
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      getCart,
      refreshCart: fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

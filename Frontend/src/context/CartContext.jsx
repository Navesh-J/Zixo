import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const storageKey = user ? `zixo_cart_${user.username}` : null;

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [user, storageKey]);

  // 🔹 Persist cart
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, storageKey]);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.productId,
      );

      if (existing) {
        toast.info(`QUANTITY_INCREASED: ${product.productName}`);
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      toast.success(`ARTIFACT_ACQUIRED: ${product.productName}`);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const item = prev.find(i => i.productId === productId);
      if (item) toast.error(`REMOVED: ${item.productName} purged from logs.`);
      return prev.filter((item) => item.productId !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("CACHE_CLEARED: Inventory logs wiped.");
  }, []);

  // 🔹 Derived values
  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  // 🔹 Backend order payload
  const cartItemsForOrder = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalAmount,
      cartCount,
      cartItemsForOrder,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalAmount,
      cartCount,
      cartItemsForOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

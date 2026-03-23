import { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// Saldo cashback simulado de la cuenta del usuario
const CASHBACK_DISPONIBLE = 350.00;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cloe-cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cashbackAplicado, setCashbackAplicado] = useState(false);

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem("cloe-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const key = `${product.id}-${product.color || ""}-${product.size || ""}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + (product.qty || 1) } : i);
      }
      return [...prev, { ...product, key, qty: product.qty || 1 }];
    });
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty < 1) { removeItem(key); return; }
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => { setItems([]); setCashbackAplicado(false); };

  const subtotal   = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const envio      = subtotal >= 1499 ? 0 : 149;
  const cashbackMonto = cashbackAplicado ? Math.min(CASHBACK_DISPONIBLE, subtotal * 0.15) : 0;
  const total      = subtotal + envio - cashbackMonto;
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      subtotal, envio, total, totalItems,
      cashbackDisponible: CASHBACK_DISPONIBLE,
      cashbackAplicado, setCashbackAplicado,
      cashbackMonto,
    }}>
      {children}
    </CartContext.Provider>
  );
}
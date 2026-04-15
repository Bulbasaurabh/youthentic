import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState("self");

  const DELIVERY_FEE = 5.00; // SGD 5.00

  // ── ADD ──────────────────────────────────────────────────────────
  // cartKey = product.id + "_" + variant (e.g. "abc123_10ml")
  // so same scent in different sizes = separate line items
  const addToCart = (product, variant = "10ml", options = {}) => {
    const customKeySuffix = options.customKeySuffix ? `_${options.customKeySuffix}` : "";
    const cartKey = `${product.id}_${variant}${customKeySuffix}`;
    const quantityToAdd = Math.max(1, Number(options.quantity) || 1);
    const priceForVariant =
      variant === "50ml" && product.price_50ml != null
        ? product.price_50ml
        : product.price;

    setCart((prev) => {
      const existing = prev.find((p) => p.cartKey === cartKey);
      if (existing) {
        return prev.map((p) =>
          p.cartKey === cartKey ? { ...p, quantity: p.quantity + quantityToAdd } : p
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartKey,
          variant,                      // "10ml" | "50ml" | "bundle"
          price: priceForVariant,       // use variant-specific price
          bundleSelections: options.bundleSelections ?? undefined,
          quantity: quantityToAdd,
        },
      ];
    });
  };

  // ── UPDATE QTY ───────────────────────────────────────────────────
  const updateQuantity = (cartKey, newQty) => {
    if (newQty < 1) {
      removeFromCart(cartKey);
      return;
    }
    setCart((prev) =>
      prev.map((p) => (p.cartKey === cartKey ? { ...p, quantity: newQty } : p))
    );
  };

  // ── REMOVE ───────────────────────────────────────────────────────
  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((p) => p.cartKey !== cartKey));
  };

  // ── CLEAR ────────────────────────────────────────────────────────
  const clearCart = () => setCart([]);

  // ── TOTALS ───────────────────────────────────────────────────────
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const finalTotal =
    deliveryOption === "delivery" ? total + DELIVERY_FEE : total;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        deliveryOption,
        setDeliveryOption,
        total,
        finalTotal,
        DELIVERY_FEE,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
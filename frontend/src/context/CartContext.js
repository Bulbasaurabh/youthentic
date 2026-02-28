import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState("self");

  const DELIVERY_FEE = 500; // $5.00

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const finalTotal =
    deliveryOption === "delivery"
      ? total + DELIVERY_FEE
      : total;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        deliveryOption,
        setDeliveryOption,
        total,
        finalTotal,
        DELIVERY_FEE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
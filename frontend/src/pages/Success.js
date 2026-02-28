import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const Success = () => {
  const { cart } = useCart();

  useEffect(() => {
    console.log("Payment successful");
  }, []);

  return (
    <div className="page">
      <h1>Payment Successful 🎉</h1>
      <p>Your order has been confirmed.</p>

      <a href="/products">
        <button>Continue Shopping</button>
      </a>
    </div>
  );
};

export default Success;
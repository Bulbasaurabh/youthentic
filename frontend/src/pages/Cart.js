import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, finalTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="page">
        <h1>Your Cart is Empty</h1>
        <Link to="/products">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <p>
            {item.name} x {item.quantity}
          </p>
          <p>
            ${((item.price * item.quantity) / 100).toFixed(2)}
          </p>
        </div>
      ))}

      <h2>Total: ${(finalTotal / 100).toFixed(2)}</h2>

      <Link to="/checkout">
        <button>Proceed to Checkout</button>
      </Link>
    </div>
  );
};

export default Cart;
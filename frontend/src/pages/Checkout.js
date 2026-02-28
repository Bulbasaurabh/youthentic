import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import API from "../api/api";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

const Checkout = () => {
  const {
    cart,
    deliveryOption,
    setDeliveryOption,
    finalTotal,
    DELIVERY_FEE,
  } = useCart();

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await API.post(
      "/create-checkout-session",
      {
        items: cart,
        deliveryOption,
      }
    );

    await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });
  };

  return (
    <div className="page">
      <h1>Checkout</h1>

      <select
        onChange={(e) => setDeliveryOption(e.target.value)}
      >
        <option value="self">Self Collect</option>
        <option value="delivery">
          Home Delivery (+${DELIVERY_FEE / 100})
        </option>
      </select>

      <h2>Total: ${(finalTotal / 100).toFixed(2)}</h2>
      <button onClick={handleCheckout}>
        Pay with Stripe
      </button>
    </div>
  );
};

export default Checkout;
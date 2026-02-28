import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="page">
      <h1>Payment Cancelled</h1>
      <p>You can return to your cart and try again.</p>

      <Link to="/cart">
        <button>Return to Cart</button>
      </Link>
    </div>
  );
};

export default Cancel;
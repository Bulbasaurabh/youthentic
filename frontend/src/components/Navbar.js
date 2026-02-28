import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <h2>Youthentic</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/brand-story">Brand Story</Link>
        <Link to="/products">Products</Link>
        <Link to="/quiz">Scent Quiz</Link>
        <Link to="/loyalty">Loyalty</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import BrandStory from "./pages/BrandStory";
import Products from "./pages/Products";
import ScentQuiz from "./pages/ScentQuiz";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Loyalty from "./pages/Loyalty";
import Admin from "./pages/Admin";

import { CartProvider } from "./context/CartContext";
import { LoyaltyProvider } from "./context/LoyaltyContext";

import "./App.css";

function App() {
  return (
    <LoyaltyProvider>
      <CartProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand-story" element={<BrandStory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/quiz" element={<ScentQuiz />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

        </Router>
      </CartProvider>
    </LoyaltyProvider>
  );
}

export default App;
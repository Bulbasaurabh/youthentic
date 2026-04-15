import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {useEffect} from "react";
import Navbar from "./components/Navbar";
import Popups from "./components/Popups";

import Home from "./pages/Home";
import BrandStory from "./pages/BrandStory";
import Products from "./pages/Products";
import ScentQuiz from "./pages/ScentQuiz";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Loyalty from "./pages/Loyalty";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

import { CartProvider } from "./context/CartContext";
import { LoyaltyProvider } from "./context/LoyaltyContext";

import "./App.css";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}


function App() {
  const warmBackend = async () => {
  const url = `${process.env.REACT_APP_API_URL}/`;
  for (let i = 0; i < 3; i++) {
    try {
      await fetch(url);
      return; // success
    } catch {
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s then retry
    }
  }
};

useEffect(() => {
  warmBackend();
}, []);
  return (
    <LoyaltyProvider>
      <CartProvider>
        <Router>
          <ScrollToTopOnRouteChange />

          {/* Popups render once globally — they manage their own localStorage state */}
          <Popups />

          <Routes>
            {/* Admin — fully standalone, no Navbar */}
            <Route path="/admin" element={<Admin />} />

            {/* All other pages get Navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/"            element={<Home />} />
                  <Route path="/brand-story" element={<BrandStory />} />
                  <Route path="/products"    element={<Products />} />
                  <Route path="/quiz"        element={<ScentQuiz />} />
                  <Route path="/cart"        element={<Cart />} />
                  <Route path="/checkout"    element={<Checkout />} />
                  <Route path="/success"     element={<Success />} />
                  <Route path="/cancel"      element={<Cancel />} />
                  <Route path="/loyalty"     element={<Loyalty />} />
                  <Route path="/login"       element={<Login />} />
                  <Route path="/orders"      element={<Orders />} />
                </Routes>
              </>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </LoyaltyProvider>
  );
}

export default App;
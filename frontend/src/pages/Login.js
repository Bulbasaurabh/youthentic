import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/api";
import Footer from "../components/Footer";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black: #000; --dark: #0a0a0a; --panel: #111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #fff; --muted: #888; --border: rgba(201,168,76,0.2);
    --red: #e05a4a;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; }

  .lg-page { min-height: 100svh; background: var(--black); display: flex; flex-direction: column; }

  .lg-main {
    flex: 1; display: grid; grid-template-columns: 1fr 1fr;
    min-height: calc(100svh - 60px);
  }

  /* left panel */
  .lg-left {
    background: var(--dark); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 3rem; gap: 2rem; position: relative; overflow: hidden;
  }
  .lg-left__glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%);
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(180,130,40,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .lg-left__wordmark {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none;
  }
  .lg-left__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(5rem, 12vw, 10rem);
    color: transparent; -webkit-text-stroke: 1px rgba(201,168,76,0.07);
    white-space: nowrap; letter-spacing: 0.04em;
  }
  .lg-left__content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; gap: 1.25rem; align-items: center; }
  .lg-left__icon { font-size: 2.5rem; }
  .lg-left__eyebrow { font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .lg-left__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4.5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .lg-left__title span { color: var(--gold); }
  .lg-left__sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 300; font-style: italic; color: var(--muted);
    max-width: 30ch; line-height: 1.8;
  }
  .lg-left__features { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem; }
  .lg-left__feature {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.78rem; color: var(--muted);
  }
  .lg-left__feature::before { content: '✦'; color: var(--gold); font-size: 0.55rem; flex-shrink: 0; }

  /* right panel */
  .lg-right {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 3rem;
  }
  .lg-form-wrap { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 2rem; }

  .lg-form-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
    letter-spacing: 0.06em; color: var(--white);
  }
  .lg-form-sub { font-size: 0.8rem; color: var(--muted); line-height: 1.6; margin-top: -1rem; }

  .lg-field { display: flex; flex-direction: column; gap: 0.5rem; }
  .lg-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .lg-input {
    background: var(--panel); border: 1px solid var(--border); color: var(--white);
    font-family: 'Jost', sans-serif; font-size: 0.88rem; letter-spacing: 0.04em;
    padding: 0.85rem 1rem; outline: none; transition: border-color 0.2s; width: 100%;
  }
  .lg-input::placeholder { color: #444; }
  .lg-input:focus { border-color: var(--gold); }
  .lg-input--error { border-color: var(--red); }

  .lg-error {
    font-size: 0.72rem; color: var(--red); display: flex; align-items: center; gap: 0.4rem;
  }

  .lg-btn {
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; border: none;
    padding: 1rem 2rem; cursor: pointer; width: 100%;
    transition: background 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .lg-btn:hover:not(:disabled) { background: var(--gold2); transform: translateY(-2px); }
  .lg-btn:disabled { background: #1a1a1a; color: #555; cursor: not-allowed; }
  .lg-btn.loading { background: #1a1a1a; color: var(--gold); pointer-events: none; }

  .lg-spinner {
    width: 0.9rem; height: 0.9rem; border-radius: 50%;
    border: 2px solid rgba(201,168,76,0.2); border-top-color: var(--gold);
    animation: spin 0.7s linear infinite;
  }

  .lg-divider { height: 1px; background: var(--border); }

  .lg-back {
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
    transition: color 0.2s;
  }
  .lg-back:hover { color: var(--gold); }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .lg-main { grid-template-columns: 1fr; }
    .lg-left { display: none; }
    .lg-right { padding: 3rem 1.5rem; }
  }
`;

const Login = () => {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/orders?email=${encodeURIComponent(trimmed)}`);
      // pass orders + email through navigation state
      navigate("/orders", { state: { orders: res.data, email: trimmed } });
    } catch (e) {
      console.error(e);
      setError("Couldn't find orders for that email. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lg-page">
        <div className="lg-main">

          {/* LEFT */}
          <div className="lg-left">
            <div className="lg-left__glow" aria-hidden="true" />
            <div className="lg-left__wordmark" aria-hidden="true"><span>ORDERS</span></div>
            <div className="lg-left__content">
              <span className="lg-left__icon">📦</span>
              <p className="lg-left__eyebrow">Youthentic Singapore</p>
              <h1 className="lg-left__title">TRACK YOUR<br /><span>ORDER.</span></h1>
              <p className="lg-left__sub">
                Enter the email you used at checkout to view your order history.
              </p>
              <div className="lg-left__features">
                <span className="lg-left__feature">View order status and items</span>
                <span className="lg-left__feature">Check delivery method</span>
                <span className="lg-left__feature">See your loyalty points earned</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg-right">
            <div className="lg-form-wrap">
              <div>
                <h2 className="lg-form-title">TRACK ORDER</h2>
                <p className="lg-form-sub">Enter your email address to view your orders.</p>
              </div>

              <div className="lg-field">
                <label className="lg-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className={`lg-input${error ? " lg-input--error" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
                {error && <span className="lg-error">⚠ {error}</span>}
              </div>

              <button
                className={`lg-btn${loading ? " loading" : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <><div className="lg-spinner" /> Looking up orders…</> : "View My Orders →"}
              </button>

              <div className="lg-divider" />

              <Link to="/products" className="lg-back">← Back to Shop</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
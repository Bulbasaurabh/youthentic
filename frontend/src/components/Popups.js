import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  /* ── SHARED OVERLAY ─────────────────────────────────────────────── */
  .yt-popup-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.88); backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; animation: popupFadeIn 0.4s ease;
  }

  /* ── REGION POPUP ───────────────────────────────────────────────── */
  .yt-region-popup {
    background: #0a0a0a; border: 1px solid rgba(201,168,76,0.25);
    width: 100%; max-width: 480px; padding: 3rem 2.5rem;
    display: flex; flex-direction: column; gap: 2rem; text-align: center;
    position: relative; animation: popupSlideUp 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .yt-region-popup__globe { font-size: 2.5rem; opacity: 0.8; }
  .yt-region-popup__eyebrow {
    font-family: 'Jost', sans-serif; font-size: 0.62rem;
    letter-spacing: 0.28em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-region-popup__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem); letter-spacing: 0.04em; color: #FFFFFF; line-height: 1;
  }
  .yt-region-popup__title span { color: #C9A84C; }
  .yt-region-popup__sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 300; font-style: italic;
    color: #888; line-height: 1.7; max-width: 34ch; margin: 0 auto;
  }
  .yt-region-popup__divider {
    height: 1px; background: rgba(201,168,76,0.15); margin: 0 -0.5rem;
  }
  .yt-region-popup__options { display: flex; flex-direction: column; gap: 0.75rem; }
  .yt-region-popup__btn-sg {
    background: #D4C028; color: #000000;
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; border: none;
    padding: 1rem 2rem; cursor: pointer; transition: background 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  }
  .yt-region-popup__btn-sg:hover { background: #E2B84A; transform: translateY(-2px); }
  .yt-region-popup__btn-id {
    background: transparent; color: #888; border: 1px solid rgba(201,168,76,0.2);
    font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.8rem 2rem; cursor: pointer; transition: border-color 0.2s, color 0.2s;
    text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .yt-region-popup__btn-id:hover { border-color: #C9A84C; color: #fff; }
  .yt-region-popup__note {
    font-size: 0.65rem; color: #444; letter-spacing: 0.06em;
  }

  /* ── MEMBERSHIP POPUP ───────────────────────────────────────────── */
  .yt-member-popup {
    background: #0a0a0a; border: 1px solid rgba(201,168,76,0.25);
    width: 100%; max-width: 560px;
    display: flex; flex-direction: column;
    position: relative; animation: popupSlideUp 0.45s cubic-bezier(0.22,1,0.36,1);
    overflow: hidden;
  }
  .yt-member-popup__glow {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 400px; height: 300px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(180,130,40,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .yt-member-popup__header {
    padding: 2.5rem 2.5rem 2rem; text-align: center;
    display: flex; flex-direction: column; gap: 1rem;
    border-bottom: 1px solid rgba(201,168,76,0.1);
    position: relative; z-index: 1;
  }
  .yt-member-popup__crown { font-size: 2rem; }
  .yt-member-popup__eyebrow {
    font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: #C9A84C;
    font-family: 'Jost', sans-serif;
  }
  .yt-member-popup__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: 0.04em; color: #fff; line-height: 0.95;
  }
  .yt-member-popup__title span { color: #C9A84C; }
  .yt-member-popup__sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem; font-weight: 300; font-style: italic; color: #888; line-height: 1.7;
  }

  /* tier strip */
  .yt-member-popup__tiers {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: rgba(201,168,76,0.1); position: relative; z-index: 1;
  }
  .yt-member-popup__tier {
    background: #0d0d0d; padding: 1.25rem 1rem; text-align: center;
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .yt-member-popup__tier-icon { font-size: 1.3rem; }
  .yt-member-popup__tier-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    letter-spacing: 0.1em;
  }
  .yt-member-popup__tier-pts {
    font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: #555;
  }
  .yt-member-popup__tier-perk {
    font-size: 0.7rem; color: #777; line-height: 1.4; margin-top: 0.25rem;
  }

  .yt-member-popup__footer {
    padding: 1.75rem 2.5rem; display: flex; flex-direction: column; gap: 0.75rem;
    position: relative; z-index: 1;
  }
  .yt-member-popup__btn-join {
    background: #D4C028; color: #000;
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; border: none;
    padding: 1rem 2rem; cursor: pointer; transition: background 0.2s, transform 0.15s; width: 100%;
  }
  .yt-member-popup__btn-join:hover { background: #E2B84A; transform: translateY(-2px); }
  .yt-member-popup__btn-skip {
    background: transparent; border: none; color: #555;
    font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer; padding: 0.5rem;
    transition: color 0.2s; text-align: center;
  }
  .yt-member-popup__btn-skip:hover { color: #888; }
  .yt-member-popup__close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    width: 2rem; height: 2rem; background: rgba(0,0,0,0.5);
    border: 1px solid rgba(201,168,76,0.2); color: #666;
    font-size: 1rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: color 0.2s, border-color 0.2s;
  }
  .yt-member-popup__close:hover { color: #fff; border-color: #C9A84C; }

  /* ── KEYFRAMES ──────────────────────────────────────────────────── */
  @keyframes popupFadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popupSlideUp  {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const REGION_KEY   = "yt_region_seen";
const MEMBER_KEY   = "yt_member_seen";

/* ── REGION POPUP ─────────────────────────────────────────────────── */
const RegionPopup = ({ onDismiss }) => (
  <div className="yt-popup-overlay">
    <div className="yt-region-popup">
      <span className="yt-region-popup__globe">🌏</span>
      <p className="yt-region-popup__eyebrow">Welcome to Youthentic</p>
      <h2 className="yt-region-popup__title">
        SELECT YOUR<br /><span>REGION.</span>
      </h2>
      <p className="yt-region-popup__sub">
        You're visiting our Singapore store.
        Choose your preferred destination to continue.
      </p>
      <div className="yt-region-popup__divider" />
      <div className="yt-region-popup__options">
        <button className="yt-region-popup__btn-sg" onClick={onDismiss}>
          🇸🇬 Proceed to Singapore Site
        </button>
        <a
          className="yt-region-popup__btn-id"
          href="https://youthentic.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onDismiss}
        >
          🇮🇩 Visit Indonesia Site ↗
        </a>
      </div>
      <p className="yt-region-popup__note">
        This selection will be remembered for your next visit.
      </p>
    </div>
  </div>
);

/* ── MEMBERSHIP POPUP ─────────────────────────────────────────────── */
const MemberPopup = ({ onDismiss }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    onDismiss();
    navigate("/loyalty");
  };

  return (
    <div className="yt-popup-overlay">
      <div className="yt-member-popup">
        <div className="yt-member-popup__glow" aria-hidden="true" />
        <button className="yt-member-popup__close" onClick={onDismiss}>✕</button>

        <div className="yt-member-popup__header">
          <span className="yt-member-popup__crown">✦</span>
          <p className="yt-member-popup__eyebrow">Youthentic Rewards</p>
          <h2 className="yt-member-popup__title">
            EARN WITH<br /><span>EVERY DROP.</span>
          </h2>
          <p className="yt-member-popup__sub">
            Join our loyalty program and earn points on every purchase.
            Unlock exclusive tiers and members-only privileges.
          </p>
        </div>

        <div className="yt-member-popup__tiers">
          {[
            { icon: "🥉", name: "Bronze", pts: "0 pts",    color: "#cd7f32", perk: "1× points on every purchase" },
            { icon: "🥈", name: "Silver", pts: "500 pts",  color: "#a8a9ad", perk: "1.5× points + early access" },
            { icon: "🏆", name: "Gold",   pts: "2000 pts", color: "#C9A84C", perk: "2× points + 10% discount" },
          ].map((t) => (
            <div key={t.name} className="yt-member-popup__tier">
              <span className="yt-member-popup__tier-icon">{t.icon}</span>
              <span className="yt-member-popup__tier-name" style={{ color: t.color }}>{t.name}</span>
              <span className="yt-member-popup__tier-pts">{t.pts}</span>
              <p className="yt-member-popup__tier-perk">{t.perk}</p>
            </div>
          ))}
        </div>

        <div className="yt-member-popup__footer">
          <button className="yt-member-popup__btn-join" onClick={handleJoin}>
            Join Now — It's Free →
          </button>
          <button className="yt-member-popup__btn-skip" onClick={onDismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── CONTROLLER — renders correct popup in sequence ───────────────── */
const Popups = () => {
  const [step, setStep] = useState(null); // null | "region" | "member"

  useEffect(() => {
    const regionSeen = localStorage.getItem(REGION_KEY);
    const memberSeen = localStorage.getItem(MEMBER_KEY);

    if (!regionSeen) {
      setStep("region");
    } else if (!memberSeen) {
      // slight delay so it doesn't flash immediately on load
      const t = setTimeout(() => setStep("member"), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissRegion = () => {
    localStorage.setItem(REGION_KEY, "1");
    const memberSeen = localStorage.getItem(MEMBER_KEY);
    if (!memberSeen) {
      setTimeout(() => setStep("member"), 400);
    } else {
      setStep(null);
    }
  };

  const dismissMember = () => {
    localStorage.setItem(MEMBER_KEY, "1");
    setStep(null);
  };

  if (!step) return null;

  return (
    <>
      <style>{css}</style>
      {step === "region" && <RegionPopup onDismiss={dismissRegion} />}
      {step === "member" && <MemberPopup onDismiss={dismissMember} />}
    </>
  );
};

export default Popups;
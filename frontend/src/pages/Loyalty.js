import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLoyalty } from "../context/LoyaltyContext";
import { getRenewalStatus } from "../utils/loyaltyRenewal";
import API from "../api/api";
import Footer from "../components/Footer";

const assetUrl = (fileName) => `${process.env.PUBLIC_URL || ""}/assets/${encodeURIComponent(fileName)}`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black:  #000000;
    --dark:   #0a0a0a;
    --panel:  #111111;
    --gold:   #C9A84C;
    --gold2:  #E2B84A;
    --yellow: #D4C028;
    --white:  #FFFFFF;
    --muted:  #888888;
    --border: rgba(201,168,76,0.2);
    --bronze: #cd7f32;
    --silver: #a8a9ad;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  .ly-page { min-height: 100svh; background: var(--black); display: flex; flex-direction: column; }

  /* ── HERO ───────────────────────────────────────────────────────── */
  .ly-hero {
    position: relative; padding: 10rem 3rem 5rem;
    border-bottom: 1px solid var(--border); overflow: hidden;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1.25rem;
  }
  .ly-hero__wordmark {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .ly-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(7rem, 18vw, 16rem);
    color: transparent; -webkit-text-stroke: 1px rgba(201,168,76,0.08);
    white-space: nowrap; letter-spacing: 0.02em;
  }
  .ly-hero__glow {
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 500px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(180,130,40,0.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .ly-hero__eyebrow {
    position: relative; z-index: 1;
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
    animation: fadeUp 0.7s ease forwards 0.2s; opacity: 0;
  }
  .ly-hero__title {
    position: relative; z-index: 1;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 7.5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0;
  }
  .ly-hero__title span { color: var(--gold); }
  .ly-hero__sub {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif; font-size: clamp(1rem, 1.5vw, 1.15rem);
    font-weight: 400; font-style: italic; color: rgba(255,255,255,0.9); max-width: 52ch; line-height: 1.85;
    padding: 0.8rem 1.1rem;
    background: rgba(0,0,0,0.42);
    border: 1px solid rgba(201,168,76,0.2);
    text-shadow: 0 1px 1px rgba(0,0,0,0.55);
    animation: fadeUp 0.8s ease forwards 0.45s; opacity: 0;
  }

  .ly-signup {
    position: relative; z-index: 1;
    width: min(720px, 100%);
    display: flex; flex-direction: column; gap: 0.8rem;
    padding: 1rem;
    border: 1px solid rgba(201,168,76,0.2);
    background: rgba(0,0,0,0.45);
    animation: fadeUp 0.8s ease forwards 0.55s; opacity: 0;
  }
  .ly-signup__label {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold);
  }
  .ly-signup__row { display: flex; gap: 0.6rem; align-items: center; }
  .ly-signup__input {
    flex: 1;
    background: var(--panel); border: 1px solid var(--border);
    color: var(--white); font-family: 'Jost', sans-serif; font-size: 0.82rem;
    letter-spacing: 0.04em; padding: 0.7rem 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .ly-signup__input:focus { border-color: var(--gold); }
  .ly-signup__btn {
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.76rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; padding: 0.74rem 1.2rem; cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .ly-signup__btn:hover { background: var(--gold2); }
  .ly-signup__btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ly-signup__help { font-size: 0.74rem; color: var(--muted); line-height: 1.5; text-align: left; }
  .ly-signup__msg { font-size: 0.74rem; color: #6dbf82; text-align: left; }
  .ly-signup__error { font-size: 0.74rem; color: #e05a4a; text-align: left; }

  /* ── CURRENT STATUS CARD ────────────────────────────────────────── */
  .ly-status {
    padding: 4rem 3rem;
    border-bottom: 1px solid var(--border);
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
  }
  .ly-status__left {
    padding-right: 3rem; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 2rem;
  }
  .ly-status__right {
    padding-left: 3rem;
    display: flex; flex-direction: column; gap: 2rem; justify-content: center;
  }
  .ly-status__eyebrow {
    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
  }

  /* tier badge */
  .ly-tier-badge {
    display: inline-flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  }
  .ly-tier-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem); letter-spacing: 0.06em; line-height: 1;
  }
  .ly-tier-icon {
    width: 3rem; height: 3rem;
    display: inline-flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 0 12px var(--tier-glow, transparent));
  }
  .ly-tier-icon img,
  .ly-tier-card__icon img,
  .ly-renewal__rule-icon img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }

  /* points display */
  .ly-points-wrap { display: flex; flex-direction: column; gap: 0.4rem; }
  .ly-points-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 7vw, 6rem); letter-spacing: 0.04em;
    color: var(--gold); line-height: 1;
  }
  .ly-points-label {
    font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted);
  }

  /* progress to next tier */
  .ly-progress { display: flex; flex-direction: column; gap: 0.75rem; }
  .ly-progress__labels {
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .ly-progress__current { font-size: 0.72rem; color: var(--muted); }
  .ly-progress__next    { font-size: 0.72rem; color: var(--white); font-weight: 500; }
  .ly-progress__track {
    height: 3px; background: rgba(201,168,76,0.1); border-radius: 2px; overflow: hidden;
  }
  .ly-progress__fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }
  .ly-progress__hint {
    font-size: 0.75rem; color: var(--muted); line-height: 1.6;
  }
  .ly-progress__hint strong { color: var(--gold); }

  .ly-maxed {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid rgba(201,168,76,0.35); padding: 0.6rem 1.2rem;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold);
  }

  /* current benefits list */
  .ly-cur-benefits { display: flex; flex-direction: column; gap: 0.6rem; }
  .ly-cur-benefit {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.82rem; color: var(--muted); line-height: 1.4;
  }
  .ly-cur-benefit::before {
    content: '✦'; color: var(--gold); font-size: 0.55rem; flex-shrink: 0;
  }

  /* ── TIER TABLE ─────────────────────────────────────────────────── */
  .ly-tiers {
    padding: 5rem 3rem; border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 3rem;
  }
  .ly-tiers__header { display: flex; flex-direction: column; gap: 0.75rem; }
  .ly-tiers__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ly-tiers__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .ly-tiers__title span { color: var(--gold); }

  /* tier cards */
  .ly-tier-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); }
  .ly-tier-card {
    background: var(--dark); padding: 2.5rem 2rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    position: relative; overflow: hidden;
    transition: background 0.3s;
  }
  .ly-tier-card:hover { background: var(--panel); }
  .ly-tier-card.current {
    background: var(--panel);
    box-shadow: inset 0 0 0 1px var(--tier-color, var(--gold));
  }
  .ly-tier-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--tier-color, var(--gold));
    opacity: 0.6;
  }
  .ly-tier-card.current::after { opacity: 1; }

  .ly-tier-card__ghost {
    position: absolute; top: -1rem; right: -1rem;
    font-family: 'Bebas Neue', sans-serif; font-size: 7rem;
    color: transparent;
    opacity: 0.06; line-height: 1; pointer-events: none; user-select: none;
    letter-spacing: 0.02em;
  }

  .ly-tier-card__head { display: flex; align-items: center; gap: 1rem; }
  .ly-tier-card__icon {
    width: 2.4rem; height: 2.4rem; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 0 10px var(--tier-glow, transparent));
  }
  .ly-tier-card__name {
    font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
    letter-spacing: 0.06em; line-height: 1;
  }
  .ly-tier-card__current-tag {
    font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid; padding: 0.2rem 0.6rem; margin-left: auto;
    white-space: nowrap;
  }

  .ly-tier-card__range {
    font-size: 0.72rem; color: var(--muted); letter-spacing: 0.08em;
  }
  .ly-tier-card__range span { color: var(--white); }

  .ly-tier-card__benefits { display: flex; flex-direction: column; gap: 0.6rem; }
  .ly-tier-card__benefit {
    display: flex; align-items: flex-start; gap: 0.65rem;
    font-size: 0.8rem; color: var(--muted); line-height: 1.5;
  }
  .ly-tier-card__benefit::before {
    content: ''; font-size: 0.65rem; flex-shrink: 0; margin-top: 0.15rem;
  }

  /* ── HOW IT WORKS ───────────────────────────────────────────────── */
  .ly-how {
    padding: 5rem 3rem; border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 3rem;
  }
  .ly-how__header { display: flex; flex-direction: column; gap: 0.75rem; }
  .ly-how__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ly-how__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }

  .ly-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); }
  .ly-step {
    background: var(--dark); padding: 2.5rem 2rem;
    display: flex; flex-direction: column; gap: 1rem;
    transition: background 0.25s;
  }
  .ly-step:hover { background: var(--panel); }
  .ly-step__num {
    font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem;
    color: rgba(201,168,76,0.2); line-height: 1; letter-spacing: 0.04em;
  }
  .ly-step__icon { font-size: 1.5rem; }
  .ly-step__label {
    font-family: 'Cormorant Garamond', serif; font-size: 1.4rem;
    font-weight: 400; color: var(--white); line-height: 1.2;
  }
  .ly-step__sub { font-size: 0.8rem; color: var(--muted); line-height: 1.7; }


  /* ── RENEWAL SECTION ────────────────────────────────────────────── */
  .ly-renewal {
    padding: 5rem 3rem; border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 3rem;
  }
  .ly-renewal__header { display: flex; flex-direction: column; gap: 0.75rem; }
  .ly-renewal__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ly-renewal__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .ly-renewal__title span { color: var(--gold); }
  .ly-renewal__sub {
    font-size: 0.85rem; color: var(--muted); line-height: 1.8; max-width: 58ch;
  }

  /* status card — shown if user has an email/orders loaded */
  .ly-renewal__status {
    border: 1px solid var(--border); background: var(--dark);
    display: flex; flex-direction: column; gap: 0;
    overflow: hidden;
  }
  .ly-renewal__status-header {
    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }
  .ly-renewal__status-tier {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 0.08em;
  }
  .ly-renewal__status-expiry {
    font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted);
  }
  .ly-renewal__status-expiry strong { color: var(--white); }
  .ly-renewal__status-body { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }

  /* progress bar */
  .ly-renewal__bar-labels {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 0.72rem; margin-bottom: 0.5rem;
  }
  .ly-renewal__bar-spent { color: var(--white); font-weight: 500; }
  .ly-renewal__bar-required { color: var(--muted); }
  .ly-renewal__bar-track {
    height: 4px; background: rgba(201,168,76,0.1); border-radius: 2px; overflow: hidden;
  }
  .ly-renewal__bar-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }
  .ly-renewal__bar-fill--safe  { background: linear-gradient(90deg, #6dbf82, #8fd4a0); }
  .ly-renewal__bar-fill--risk  { background: linear-gradient(90deg, #e8a84c, var(--gold)); }
  .ly-renewal__bar-fill--danger{ background: linear-gradient(90deg, #e05a4a, #e8804a); }

  .ly-renewal__hint {
    font-size: 0.78rem; line-height: 1.6; padding: 0.9rem 1.1rem;
    border: 1px solid; border-radius: 2px;
  }
  .ly-renewal__hint--safe   { color: #6dbf82; border-color: rgba(109,191,130,0.3); background: rgba(109,191,130,0.06); }
  .ly-renewal__hint--risk   { color: #e8a84c; border-color: rgba(232,168,76,0.3); background: rgba(232,168,76,0.06); }
  .ly-renewal__hint--danger { color: #e05a4a; border-color: rgba(224,90,74,0.3); background: rgba(224,90,74,0.06); }

  /* rules table */
  .ly-renewal__rules { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); }
  .ly-renewal__rule {
    background: var(--dark); padding: 2rem;
    display: flex; flex-direction: column; gap: 1rem;
    transition: background 0.25s;
  }
  .ly-renewal__rule:hover { background: var(--panel); }
  .ly-renewal__rule-head { display: flex; align-items: center; gap: 1rem; }
  .ly-renewal__rule-icon {
    width: 2.2rem; height: 2.2rem; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 0 10px var(--tier-glow, transparent));
  }
  .ly-renewal__rule-tier {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 0.08em;
  }
  .ly-renewal__rule-body { display: flex; flex-direction: column; gap: 0.6rem; }
  .ly-renewal__rule-req {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem;
    letter-spacing: 0.05em; color: var(--gold); line-height: 1;
  }
  .ly-renewal__rule-period { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .ly-renewal__rule-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.7; }
  .ly-renewal__rule-fail {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.7rem; color: var(--muted); padding: 0.6rem 0.9rem;
    border: 1px solid rgba(201,168,76,0.1); background: rgba(0,0,0,0.3);
  }
  .ly-renewal__rule-fail::before { content: '⚠'; font-size: 0.7rem; }

  .ly-renewal__note {
    font-size: 0.75rem; color: var(--muted); line-height: 1.8; padding: 1.25rem 1.5rem;
    border: 1px solid var(--border); background: var(--dark);
    display: flex; gap: 0.75rem;
  }
  .ly-renewal__note::before { content: '✦'; color: var(--gold); font-size: 0.55rem; flex-shrink: 0; margin-top: 0.2rem; }

  @media (max-width: 768px) {
    .ly-renewal { padding: 3.5rem 1.5rem; }
    .ly-renewal__rules { grid-template-columns: 1fr; }
    .ly-renewal__status-header { flex-direction: column; align-items: flex-start; }
  }

  /* ── CTA ────────────────────────────────────────────────────────── */
  .ly-cta {
    padding: 6rem 3rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 2rem;
    background: var(--dark); border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
  }
  .ly-cta::before {
    content: '✦';
    position: absolute; font-size: 20rem; color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.06);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .ly-cta__title {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 4rem); font-weight: 300; line-height: 1.1; color: var(--white);
  }
  .ly-cta__title em { font-style: italic; color: var(--gold); }
  .ly-cta__sub {
    position: relative; z-index: 1;
    font-size: 0.88rem; color: var(--muted); max-width: 44ch; line-height: 1.9;
  }
  .ly-cta__btn {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.9rem 2.5rem;
    cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s;
  }
  .ly-cta__btn:hover { background: var(--gold2); transform: translateY(-2px); }

  /* ── FOOTER ─────────────────────────────────────────────────────── */
  .yt-footer {
    background: var(--black); border-top: 1px solid var(--border);
    padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .yt-footer__brand { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.2em; color: var(--gold); }
  .yt-footer__links { display: flex; gap: 2rem; list-style: none; }
  .yt-footer__links a { font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; }
  .yt-footer__links a:hover { color: var(--gold); }
  .yt-footer__copy { font-size: 0.72rem; color: rgba(136,136,136,0.5); }

  /* ── KEYFRAMES ──────────────────────────────────────────────────── */
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .ly-hero { padding: 8rem 1.5rem 4rem; }
    .ly-status { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
    .ly-status__left { padding-right: 0; border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 2.5rem; }
    .ly-status__right { padding-left: 0; }
    .ly-tier-cards { grid-template-columns: 1fr; }
    .ly-steps { grid-template-columns: 1fr; }
    .ly-tiers, .ly-how, .ly-cta { padding: 3.5rem 1.5rem; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
    .ly-signup__row { flex-direction: column; align-items: stretch; }
    .ly-signup__btn { width: 100%; }
  }
`;

const TIER_ICONS = {
  Bronze: assetUrl("Bronze.png"),
  Silver: assetUrl("Silver.png"),
  Gold: assetUrl("Gold.png"),
};

const Loyalty = () => {
  const { points, tier, tierData, nextTier, TIERS, email, fetchLoyalty } = useLoyalty();
  const [orders,   setOrders]   = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupMsg, setSignupMsg] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("yt_member_profile") || "null");
      const storedEmail = (stored?.email || "").trim();
      if (storedEmail) {
        setSignupEmail(storedEmail);
        if (!email) fetchLoyalty(storedEmail);
      }
    } catch {
      // ignore malformed local storage
    }
  }, [email, fetchLoyalty]);

  // fetch orders to compute renewal points — uses email from LoyaltyContext
  useEffect(() => {
    if (!email) return;
    API.get(`/orders?email=${encodeURIComponent(email)}`)
      .then((res) => setOrders(res.data))
      .catch(() => {});
    API.get(`/users/loyalty?email=${encodeURIComponent(email)}`)
      .then((res) => setCreatedAt(res.data.created_at ?? null))
      .catch(() => {});
  }, [email]);

  const renewal = getRenewalStatus(tier, createdAt, orders);

  // progress toward next tier
  const progressPct = nextTier
    ? Math.min(100, Math.round(((points - tierData.min) / (nextTier.min - tierData.min)) * 100))
    : 100;
  const ptsToNext = nextTier ? nextTier.min - points : 0;
  const approxSgdToNext = nextTier
    ? Math.ceil(ptsToNext / Math.max(1, tierData.multiplier || 1))
    : 0;

  const handleSignup = async () => {
    const normalizedEmail = signupEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setSignupError("Please enter a valid email address.");
      setSignupMsg("");
      return;
    }

    setSignupLoading(true);
    setSignupError("");
    setSignupMsg("");

    try {
      await API.post("/users", { email: normalizedEmail });

      localStorage.setItem("yt_member_profile", JSON.stringify({
        email: normalizedEmail,
        tier: "Bronze",
        isMember: true,
        updatedAt: Date.now(),
      }));

      await fetchLoyalty(normalizedEmail);
      setSignupMsg("Membership ready. Your account has been created.");
    } catch (e) {
      setSignupError(e?.response?.data?.detail || "Couldn't create your account. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ly-page">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="ly-hero">
          <div className="ly-hero__wordmark" aria-hidden="true"><span>REWARDS</span></div>
          <div className="ly-hero__glow" aria-hidden="true" />
          <p className="ly-hero__eyebrow">Youthentic Singapore · Members</p>
          <h1 className="ly-hero__title">LOYALTY<br /><span>REWARDS.</span></h1>
          <p className="ly-hero__sub">
            Every SGD you spend earns points. Points unlock tiers.
            Tiers unlock privileges that make every Youthentic purchase better.
          </p>

          <div className="ly-signup">
            <p className="ly-signup__label">Member Signup</p>
            <div className="ly-signup__row">
              <input
                className="ly-signup__input"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email for loyalty signup"
              />
              <button
                type="button"
                className="ly-signup__btn"
                onClick={handleSignup}
                disabled={signupLoading}
              >
                {signupLoading ? "Creating..." : "Sign Up"}
              </button>
            </div>
            <p className="ly-signup__help">Sign up once to create your loyalty account and start earning points.</p>
            {signupMsg && <p className="ly-signup__msg">{signupMsg}</p>}
            {signupError && <p className="ly-signup__error">{signupError}</p>}
          </div>
        </section>

        {/* ── CURRENT STATUS ──────────────────────────────────────── */}
        <section className="ly-status">
          <div className="ly-status__left">
            <p className="ly-status__eyebrow">Your Current Standing</p>

            {/* tier badge */}
            <div className="ly-tier-badge">
              <span
                className="ly-tier-name"
                style={{ color: tierData.color }}
              >
                {tier}
              </span>
              <span
                className="ly-tier-icon"
                style={{ "--tier-glow": tierData.borderColor }}
              >
                {TIER_ICONS[tier]
                  ? <img src={TIER_ICONS[tier]} alt="" aria-hidden="true" />
                  : "✦"}
              </span>
            </div>

            {/* points */}
            <div className="ly-points-wrap">
              <span className="ly-points-num">{points.toLocaleString()}</span>
              <span className="ly-points-label">Total Points Earned</span>
            </div>

            {/* progress bar */}
            {nextTier ? (
              <div className="ly-progress">
                <div className="ly-progress__labels">
                  <span className="ly-progress__current">{tier}</span>
                  <span className="ly-progress__next">{nextTier.name}</span>
                </div>
                <div className="ly-progress__track">
                  <div className="ly-progress__fill" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="ly-progress__hint">
                  Earn <strong>{ptsToNext} more points</strong> to reach {nextTier.name}.
                  That's roughly <strong>SGD {approxSgdToNext}</strong> in purchases at your current {tierData.multiplier}x tier multiplier.
                </p>
              </div>
            ) : (
              <div className="ly-maxed">
                <span>✦</span> You've reached the highest tier
              </div>
            )}
          </div>

          <div className="ly-status__right">
            <p className="ly-status__eyebrow">Your {tier} Benefits</p>
            <div className="ly-cur-benefits">
              {tierData.benefits.map((b) => (
                <div key={b} className="ly-cur-benefit">{b}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIER CARDS ──────────────────────────────────────────── */}
        <section className="ly-tiers">
          <div className="ly-tiers__header">
            <p className="ly-tiers__eyebrow">All Tiers</p>
            <h2 className="ly-tiers__title">THE FULL<br /><span>PICTURE.</span></h2>
          </div>

          <div className="ly-tier-cards">
            {TIERS.map((t) => {
              const isCurrent = t.name === tier;
              const isUnlocked = points >= t.min;
              return (
                <div
                  key={t.name}
                  className={`ly-tier-card${isCurrent ? " current" : ""}`}
                  style={{ "--tier-color": t.color }}
                >
                  <span
                    className="ly-tier-card__ghost"
                    style={{ WebkitTextStroke: `1px ${t.color}` }}
                    aria-hidden="true"
                  >
                    {t.name}
                  </span>

                  <div className="ly-tier-card__head">
                    <span className="ly-tier-card__icon" style={{ "--tier-glow": t.borderColor }} aria-hidden="true">
                      <img src={TIER_ICONS[t.name]} alt="" />
                    </span>
                    <span className="ly-tier-card__name" style={{ color: t.color }}>
                      {t.name}
                    </span>
                    {isCurrent && (
                      <span
                        className="ly-tier-card__current-tag"
                        style={{ color: t.color, borderColor: t.borderColor }}
                      >
                        Current
                      </span>
                    )}
                  </div>

                  <p className="ly-tier-card__range">
                    {t.max
                      ? <><span>{t.min.toLocaleString()}</span> – <span>{t.max.toLocaleString()}</span> pts</>
                      : <><span>{t.min.toLocaleString()}+</span> pts</>
                    }
                  </p>

                  <div className="ly-tier-card__benefits">
                    {t.benefits.map((b) => (
                      <div
                        key={b}
                        className="ly-tier-card__benefit"
                        style={{ color: isUnlocked ? "var(--white)" : "var(--muted)" }}
                      >
                        <span style={{ color: isUnlocked ? t.color : "var(--muted)" }}>✓ </span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────── */}
        <section className="ly-how">
          <div className="ly-how__header">
            <p className="ly-how__eyebrow">Simple by Design</p>
            <h2 className="ly-how__title">HOW IT WORKS.</h2>
          </div>

          <div className="ly-steps">
            {[
              {
                num: "01", icon: "🛍️",
                label: "Shop & Earn",
                sub:   "Every SGD you spend earns 1 point. Your tier multiplier is applied automatically — Silver earns 1.5×, Gold earns 2×.",
              },
              {
                num: "02", icon: "📈",
                label: "Climb the Tiers",
                sub:   "Reach 120 points for Silver, 500 for Gold. Your tier is updated automatically after each qualifying purchase.",
              },
              {
                num: "03", icon: "✦",
                label: "Unlock Privileges",
                sub:   "Gold members receive an automatic 10% discount on every order, priority release access, and 2× points on every purchase.",
              },
            ].map((s) => (
              <div key={s.num} className="ly-step">
                <span className="ly-step__num">{s.num}</span>
                <span className="ly-step__icon">{s.icon}</span>
                <p className="ly-step__label">{s.label}</p>
                <p className="ly-step__sub">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ── RENEWAL SECTION ─────────────────────────────────────── */}
        <section className="ly-renewal">
          <div className="ly-renewal__header">
            <p className="ly-renewal__eyebrow">Membership Maintenance</p>
            <h2 className="ly-renewal__title">KEEP YOUR<br /><span>STATUS.</span></h2>
            <p className="ly-renewal__sub">
              To maintain Silver or Gold status, you’ll need to meet the minimum points requirement within each 2-year period from your sign-up date. If the threshold isn’t met, your tier drops when points reset.
            </p>
          </div>

          {/* personal status card — only if we have their data */}
          {renewal && (
            <div className="ly-renewal__status">
              <div className="ly-renewal__status-header">
                <span className="ly-renewal__status-tier" style={{ color: tierData.color }}>
                  {tier} Renewal Status
                </span>
                <span className="ly-renewal__status-expiry">
                  Window closes <strong>{renewal.expiryDateStr}</strong>
                  {" "}· {renewal.daysLeft} days left
                </span>
              </div>
              <div className="ly-renewal__status-body">
                <div>
                  <div className="ly-renewal__bar-labels">
                    <span className="ly-renewal__bar-spent">
                      {Math.floor(renewal.pointsEarned)} points earned
                    </span>
                    <span className="ly-renewal__bar-required">
                      {renewal.rule.requiredPoints} points required
                    </span>
                  </div>
                  <div className="ly-renewal__bar-track">
                    <div
                      className={`ly-renewal__bar-fill${
                        renewal.pct >= 100 ? " ly-renewal__bar-fill--safe"
                        : renewal.daysLeft < 60 ? " ly-renewal__bar-fill--danger"
                        : " ly-renewal__bar-fill--risk"
                      }`}
                      style={{ width: `${renewal.pct}%` }}
                    />
                  </div>
                </div>
                <div className={`ly-renewal__hint${
                  renewal.pct >= 100 ? " ly-renewal__hint--safe"
                  : renewal.daysLeft < 60 ? " ly-renewal__hint--danger"
                  : " ly-renewal__hint--risk"
                }`}>
                  {renewal.pct >= 100
                    ? `✓ You've met the ${tier} renewal requirement. Your status is secure until ${renewal.expiryDateStr}.`
                    : renewal.daysLeft < 60
                    ? `⚠ Only ${renewal.daysLeft} days left! Earn ${Math.ceil(renewal.remaining)} more points to keep your ${tier} status.`
                    : `Earn ${Math.ceil(renewal.remaining)} more points before ${renewal.expiryDateStr} to maintain your ${tier} membership.`
                  }
                </div>
              </div>
            </div>
          )}

          {/* rules for both tiers */}
          <div className="ly-renewal__rules">
            {[
              {
                icon: TIER_ICONS.Silver, tier: "Silver", color: "#a8a9ad",
                req: "119 Points", period: "Every 2 years",
                desc: "Accumulate 119 points or more within your 2-year window maintain Silver status and full benefits.",
                fail: "Drops to Bronze · All points reset to 0",
              },
              {
                icon: TIER_ICONS.Gold, tier: "Gold", color: "#C9A84C",
                req: "500 Points", period: "Every 2 years",
                desc: "Accumulate 500 points within your 2-year window to maintain Gold status and full benefits.",
                fail: "Drops to Gold · Points reset to 0",
              },
            ].map((r) => (
              <div key={r.tier} className="ly-renewal__rule">
                <div className="ly-renewal__rule-head">
                  <span className="ly-renewal__rule-icon" aria-hidden="true">
                    <img src={r.icon} alt="" />
                  </span>
                  <span className="ly-renewal__rule-tier" style={{ color: r.color }}>{r.tier}</span>
                </div>
                <div className="ly-renewal__rule-body">
                  <span className="ly-renewal__rule-req">{r.req}</span>
                  <span className="ly-renewal__rule-period">{r.period} · From Sign-up Date</span>
                  <p className="ly-renewal__rule-desc">{r.desc}</p>
                  <div className="ly-renewal__rule-fail">{r.fail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ly-renewal__note">
            Your 2-year window is calculated from the date you first signed up.
            Points are counted from paid orders only. The window renews automatically
            at the 2-year mark — you don't need to do anything.
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="ly-cta">
          <h2 className="ly-cta__title">
            Every purchase brings you<br />closer to <em>Gold.</em>
          </h2>
          <p className="ly-cta__sub">
            {nextTier
              ? `You're ${ptsToNext} points away from ${nextTier.name}. Keep shopping to unlock more exclusive privileges.`
              : "You've reached the top. Every order now earns 2× points and an automatic 10% discount."}
          </p>
          <Link to="/products" className="ly-cta__btn">
            {nextTier ? `Shop to Reach ${nextTier.name} →` : "Shop the Collection →"}
          </Link>
        </section>

              <Footer />
      </div>
    </>
  );
};

export default Loyalty;
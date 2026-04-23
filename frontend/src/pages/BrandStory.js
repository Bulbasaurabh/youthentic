import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

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
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  .reveal {
    opacity: 0; transform: translateY(32px);
    transition: opacity 0.85s ease, transform 0.85s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left {
    opacity: 0; transform: translateX(-40px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0; transform: translateX(40px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }

  /* HERO */
  .ab-hero {
    position: relative; min-height: 100svh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding-bottom: 6rem; overflow: hidden; background: var(--black);
  }
  .ab-hero__wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 1;
  }
  .ab-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(12rem, 28vw, 24rem);
    letter-spacing: 0.02em;
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.12);
    white-space: nowrap;
    animation: fadeIn 1.4s ease forwards;
  }
  .ab-hero__rule {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1; pointer-events: none; overflow: hidden;
  }
  .ab-hero__rule::after {
    content: ''; position: absolute; width: 200%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
    top: 55%; left: -50%; transform: rotate(-8deg);
  }
  .ab-hero__glow {
    position: absolute; bottom: -100px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 300px;
    background: radial-gradient(ellipse, rgba(180,130,40,0.18) 0%, transparent 70%);
    z-index: 1; pointer-events: none;
  }
  .ab-hero__content {
    position: relative; z-index: 2; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 0 2rem;
  }
  .ab-hero__eyebrow {
    font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold);
    animation: fadeUp 0.9s ease forwards 0.3s; opacity: 0;
  }
  .ab-hero__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 7rem); font-weight: 300; line-height: 1;
    color: var(--white); animation: fadeUp 1s ease forwards 0.5s; opacity: 0;
  }
  .ab-hero__title em { font-style: italic; color: var(--gold); }
  .ab-hero__sub {
    font-size: clamp(0.95rem, 1.5vw, 1.05rem); line-height: 1.85; color: rgba(255,255,255,0.9); max-width: 52ch;
    padding: 0.8rem 1.1rem;
    background: rgba(0,0,0,0.42);
    border: 1px solid rgba(201,168,76,0.2);
    text-shadow: 0 1px 1px rgba(0,0,0,0.55);
    animation: fadeUp 1s ease forwards 0.7s; opacity: 0;
  }
  .ab-hero__scroll {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    animation: fadeUp 0.8s ease forwards 1.2s; opacity: 0;
  }
  .ab-hero__scroll span { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
  .ab-scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollLine 1.8s ease-in-out infinite;
  }

  /* MANIFESTO */
  .ab-manifesto {
    background: var(--dark); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 7rem 3rem; display: grid; grid-template-columns: auto 1fr; gap: 5rem; align-items: center;
  }
  .ab-manifesto__label {
    writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);
    font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); flex-shrink: 0;
  }
  .ab-manifesto__text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 300; line-height: 1.45; color: var(--white);
  }
  .ab-manifesto__text em { font-style: italic; color: var(--gold); }
  .ab-manifesto__text strong { font-weight: 600; }

  /* PILLARS */
  .ab-pillars { background: var(--black); padding: 8rem 3rem; }
  .ab-pillars__header {
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1px solid var(--border); padding-bottom: 2.5rem; margin-bottom: 0; gap: 2rem; flex-wrap: wrap;
  }
  .ab-pillars__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 6rem); letter-spacing: 0.04em; color: var(--white); line-height: 1;
  }
  .ab-pillars__title span { color: var(--gold); }
  .ab-pillars__intro { font-size: 0.85rem; line-height: 1.8; color: var(--muted); max-width: 36ch; text-align: right; }

  .ab-pillar {
    display: grid; grid-template-columns: 4rem 1fr auto;
    align-items: start; gap: 2rem; padding: 3rem 0;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.3s;
  }
  .ab-pillar:hover { background: rgba(201,168,76,0.03); }
  .ab-pillar:hover .ab-pillar__num { color: var(--gold2); }
  .ab-pillar:hover .ab-pillar__expand { border-color: var(--gold); color: var(--gold); }
  .ab-pillar__num {
    font-family: 'Bebas Neue', sans-serif; font-size: 3rem;
    color: rgba(201,168,76,0.25); line-height: 1; transition: color 0.3s; padding-top: 0.3rem;
  }
  .ab-pillar__body { display: flex; flex-direction: column; gap: 0.75rem; }
  .ab-pillar__tag { font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); }
  .ab-pillar__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 400; color: var(--white); line-height: 1.2;
  }
  .ab-pillar__text {
    font-size: 0.88rem; line-height: 1.85; color: var(--muted); max-width: 60ch;
    overflow: hidden; max-height: 0; opacity: 0;
    transition: max-height 0.5s ease, opacity 0.4s ease, margin-top 0.3s ease; margin-top: 0;
  }
  .ab-pillar__text.open { max-height: 200px; opacity: 1; margin-top: 0.75rem; }
  .ab-pillar__expand {
    width: 2.2rem; height: 2.2rem; border: 1px solid var(--border); border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 1.2rem; transition: all 0.25s; align-self: center; flex-shrink: 0;
    user-select: none; line-height: 1;
  }
  .ab-pillar__expand.open { border-color: var(--gold); color: var(--gold); transform: rotate(45deg); }

  /* SPLIT */
  .ab-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 60vh; border-top: 1px solid var(--border); }
  .ab-split__left {
    background: var(--panel); padding: 6rem 4rem;
    display: flex; flex-direction: column; justify-content: center; gap: 2rem;
    border-right: 1px solid var(--border);
  }
  .ab-split__right {
    background: var(--dark); padding: 6rem 4rem;
    display: flex; flex-direction: column; justify-content: center; gap: 2rem;
  }
  .ab-split__eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }
  .ab-split__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3vw, 3rem); font-weight: 300; line-height: 1.2; color: var(--white);
  }
  .ab-split__title em { font-style: italic; color: var(--gold); }
  .ab-split__body { font-size: 0.88rem; line-height: 1.9; color: var(--muted); max-width: 42ch; }
  .ab-split__stat {
    border-top: 1px solid var(--border); padding-top: 1.5rem; display: flex; gap: 3rem;
  }
  .ab-split__stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: var(--gold); line-height: 1; letter-spacing: 0.05em; }
  .ab-split__stat-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-top: 0.25rem; }

  .ab-timeline { display: flex; flex-direction: column; gap: 0; }
  .ab-timeline__item { display: flex; gap: 1.5rem; align-items: flex-start; padding-bottom: 2rem; position: relative; }
  .ab-timeline__item:not(:last-child)::before {
    content: ''; position: absolute; left: 0.35rem; top: 1.2rem;
    width: 1px; height: calc(100% - 0.5rem);
    background: linear-gradient(to bottom, var(--gold), transparent);
  }
  .ab-timeline__dot {
    width: 0.8rem; height: 0.8rem; border-radius: 50%;
    border: 1px solid var(--gold); background: var(--black);
    flex-shrink: 0; margin-top: 0.25rem; position: relative; z-index: 1;
  }
  .ab-timeline__dot.filled { background: var(--gold); }
  .ab-timeline__year {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: var(--gold);
    letter-spacing: 0.08em; line-height: 1; flex-shrink: 0; width: 3rem;
  }
  .ab-timeline__text { font-size: 0.82rem; line-height: 1.7; color: var(--muted); }
  .ab-timeline__text strong { display: block; color: var(--white); font-size: 0.88rem; margin-bottom: 0.2rem; }

  /* SG STRIP */
  .ab-sg {
    background: var(--black); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 6rem 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
  }
  .ab-sg__quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 2.5vw, 2.5rem); font-weight: 300; font-style: italic; line-height: 1.45;
    color: var(--white); border-left: 2px solid var(--gold); padding-left: 2rem;
  }
  .ab-sg__quote cite {
    display: block; margin-top: 1.2rem; font-size: 0.72rem; font-style: normal;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  }
  .ab-sg__right { display: flex; flex-direction: column; gap: 1.5rem; }
  .ab-sg__label { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ab-sg__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 2.8vw, 2.5rem); font-weight: 300; line-height: 1.2; color: var(--white);
  }
  .ab-sg__body { font-size: 0.88rem; line-height: 1.9; color: var(--muted); }
  .ab-sg__tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem; }
  .ab-sg__tag {
    border: 1px solid var(--border); padding: 0.4rem 1rem;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
    transition: border-color 0.25s, color 0.25s;
  }
  .ab-sg__tag:hover { border-color: var(--gold); color: var(--gold); }

  /* IDENTITY */
  .ab-identity {
    background: var(--dark); padding: 8rem 3rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 2.5rem;
    border-top: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .ab-identity::before {
    content: 'IDENTITY'; position: absolute;
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(8rem, 18vw, 16rem);
    color: transparent; -webkit-text-stroke: 1px rgba(201,168,76,0.07);
    pointer-events: none; top: 50%; left: 50%; transform: translate(-50%, -50%);
    white-space: nowrap; letter-spacing: 0.05em;
  }
  .ab-identity__label { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); position: relative; z-index: 1; }
  .ab-identity__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 300; line-height: 1.1;
    color: var(--white); max-width: 18ch; position: relative; z-index: 1;
  }
  .ab-identity__title em { font-style: italic; color: var(--gold); }
  .ab-identity__body {
    font-size: clamp(0.9rem, 1.2vw, 1.05rem); line-height: 2; color: var(--muted);
    max-width: 56ch; position: relative; z-index: 1;
  }
  .ab-identity__contexts {
    display: flex; flex-wrap: wrap; gap: 1px; background: var(--border);
    width: 100%; max-width: 800px; position: relative; z-index: 1; margin-top: 1rem;
  }
  .ab-identity__context {
    background: var(--dark); flex: 1; min-width: 140px; padding: 1.5rem 1rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem; transition: background 0.3s;
  }
  .ab-identity__context:hover { background: var(--panel); }
  .ab-identity__context-icon { font-size: 1.6rem; }
  .ab-identity__context-label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }

  .yt-btn-yellow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2.2rem; border-radius: 4px;
    cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s;
    position: relative; z-index: 1;
  }
  .yt-btn-yellow:hover { background: var(--gold2); transform: translateY(-2px); }

  /* KEYFRAMES */
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

  /* ── FAQ ────────────────────────────────────────────────────────── */
  .ab-faq {
    padding: 6rem 3rem; border-top: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 3rem;
  }
  .ab-faq__header { display: flex; flex-direction: column; gap: 0.75rem; }
  .ab-faq__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ab-faq__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .ab-faq__title span { color: var(--gold); }

  /* category tabs */
  .ab-faq__tabs { display: flex; gap: 0; flex-wrap: wrap; border: 1px solid var(--border); align-self: flex-start; }
  .ab-faq__tab {
    background: transparent; border: none; border-right: 1px solid var(--border);
    color: var(--muted); font-family: 'Jost', sans-serif; font-size: 0.75rem;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.5rem;
    cursor: pointer; transition: background 0.2s, color 0.2s; white-space: nowrap;
  }
  .ab-faq__tab:last-child { border-right: none; }
  .ab-faq__tab:hover { color: var(--white); }
  .ab-faq__tab.active { background: var(--gold); color: var(--black); }

  /* accordion */
  .ab-faq__list { display: flex; flex-direction: column; gap: 0; }
  .ab-faq__item {
    border: 1px solid var(--border); margin-bottom: -1px;
    transition: border-color 0.25s;
  }
  .ab-faq__item.open { border-color: rgba(201,168,76,0.4); z-index: 1; position: relative; }
  .ab-faq__question {
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    padding: 1.4rem 1.75rem; cursor: pointer; background: var(--dark);
    transition: background 0.2s;
  }
  .ab-faq__question:hover { background: #0f0f0f; }
  .ab-faq__item.open .ab-faq__question { background: rgba(201,168,76,0.04); }
  .ab-faq__q-text {
    font-family: 'Jost', sans-serif; font-size: 0.92rem; font-weight: 500;
    color: var(--white); letter-spacing: 0.02em; line-height: 1.4;
  }
  .ab-faq__chevron {
    color: var(--muted); font-size: 0.75rem; flex-shrink: 0;
    transition: transform 0.3s, color 0.2s;
  }
  .ab-faq__item.open .ab-faq__chevron { transform: rotate(180deg); color: var(--gold); }
  .ab-faq__answer {
    padding: 0 1.75rem 1.5rem; font-size: 0.84rem; color: var(--muted);
    line-height: 1.85; animation: faqSlide 0.25s ease;
    border-top: 1px solid rgba(201,168,76,0.08);
    padding-top: 1.25rem;
  }

  @keyframes faqSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width: 768px) {
    .ab-faq { padding: 4rem 1.5rem; }
    .ab-faq__tabs { width: 100%; }
    .ab-faq__tab { flex: 1; text-align: center; padding: 0.65rem 0.75rem; font-size: 0.65rem; }
  }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scrollLine {
    0%   { transform: scaleY(0); transform-origin: top; }
    50%  { transform: scaleY(1); transform-origin: top; }
    51%  { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .ab-manifesto { grid-template-columns: 1fr; gap: 2rem; padding: 4rem 1.5rem; }
    .ab-manifesto__label { writing-mode: initial; transform: none; }
    .ab-pillars { padding: 5rem 1.5rem; }
    .ab-pillar { grid-template-columns: 3rem 1fr auto; gap: 1rem; }
    .ab-pillars__header { flex-direction: column; align-items: flex-start; }
    .ab-pillars__intro { text-align: left; }
    .ab-split { grid-template-columns: 1fr; }
    .ab-split__left, .ab-split__right { padding: 4rem 1.5rem; border-right: none; border-bottom: 1px solid var(--border); }
    .ab-sg { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 3rem; }
    .ab-identity { padding: 5rem 1.5rem; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
  }
`;

const PILLARS = [
  {
    num: "01", tag: "Philosophy", name: "Every Story Deserves Its Scent",
    text: "Youthentic believes every individual carries a unique story. Our fragrances are declarations — designed to express your authentic, youthful personality in a world that demands you stand out.",
  },
  {
    num: "02", tag: "Premium Materials", name: "Sourced With Intention",
    text: "We use only premium, high-quality ingredients carefully selected from Barcelona. Each raw material is chosen for longevity, depth, and harmony with the tropical climate.",
  },
  {
    num: "03", tag: "Our Process", name: "Meticulous, Start to Finish",
    text: "Each bottle undergoes a painstaking manufacturing process. From formulation to packaging, every stage is reviewed for consistency and quality — what reaches you is the result of dozens of invisible decisions made right.",
  },
];

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};


/* ── FAQ DATA ────────────────────────────────────────────────────── */
const FAQ_CATEGORIES = ["Product", "Shipping", "Usage", "Loyalty", "Other"];

const FAQ_DATA = {
  Product: [
    { q: "What is Youthentic Lite?", a: "Youthentic Lite is our pocket-sized 10ml fragrance line — designed to be travel-friendly, MRT-safe, and easy to carry throughout your day without compromising on scent quality." },
    { q: "Are Youthentic fragrances long-lasting?", a: "Yes. Our formulas are oil-based and heat-stabilised for Singapore's humidity. You can expect 6–8 hours of wear from a single application." },
    { q: "Are the products unisex?", a: "Most of our scents are designed to be unisex or gender-neutral. Each product page includes a gender recommendation to help you choose." },
    { q: "Are Youthentic fragrances made in-house?", a: "Yes — every fragrance is formulated in Barcelona and produced by us in Indonesia, using high-quality raw materials selected from Barcelona" },
    { q: "Are the products BPOM/HSA certified?", a: "Our products are produced under Indonesian BPOM-compliant standards. For Singapore customers, our formulas comply with HSA cosmetics regulations for personal fragrance." },
    { q: "What sizes are available?", a: "We currently offer 10ml travel-size bottles and 50ml full-size. Bundle sets are also available exclusively on our website." },
  ],
  Shipping: [
    { q: "How long does delivery take in Singapore?", a: "Standard islandwide delivery takes 3–5 business days. Self-collection is also available and is typically ready within 1–2 business days. You'll receive an email with details once your order is confirmed." },
    { q: "Are there any duties or hidden fees?", a: "No hidden fees. All prices are displayed in SGD and include GST. There are no additional duties for Singapore orders — what you see at checkout is what you pay." },
    { q: "What are the shipping costs?", a: "Home delivery is a flat SGD 5.00. Orders above SGD 50 are eligible for free delivery, and Silver and Gold Tier members enjoy free shipping on all orders. We may offer free delivery promotions from time to time — check our homepage for the latest update." },
    { q: "Can I change my delivery address after ordering?", a: "Please contact us as soon as possible if you need to change your address. We can update it if your order hasn't been dispatched yet." },
    { q: "How do you ensure products are protected and won’t get damaged during delivery?", a: "All orders are packed securely with protective materials and shipped in sturdy packaging to help prevent damage during delivery." },
  ],
  Usage: [
    { q: "How do I apply the fragrance?", a: "Spray or dab onto pulse points — wrists, neck, and behind the ears. For longer wear, apply right after showering on moisturised skin. Avoid rubbing the fragrance after application as this breaks down the scent molecules." },
    { q: "Can I layer fragrances?", a: "Absolutely. Many of our customers layer complementary scents from our collection. We recommend checking the fragrance notes on each product to find combinations that work well together." },
    { q: "How should I store my fragrance?", a: "Store in a cool, dry place away from direct sunlight and heat. Avoid leaving bottles in a hot car or on a sunny windowsill, as this can degrade the fragrance over time." },
    { q: "Is the fragrance suitable for sensitive skin?", a: "Our formulas are designed to be gentle, but we recommend patch testing on a small area if you have sensitive skin. Avoid direct contact with eyes." },
  ],
  Loyalty: [
    { q: "How does the Youthentic Loyalty program work?", a: "Every SGD you spend earns loyalty points. Points accumulate toward tiers — Bronze (0–119 pts), Silver (120–499 pts), and Gold (500+ pts). Higher tiers unlock better multipliers and exclusive benefits." },
    { q: "What are the different loyalty benefits?", a: "Visit the Loyalty page on our website for a detailed breakdown, but in general: Bronze members earn 1 point per SGD, Silver members earn 1.5 points per SGD and get early access to new releases, and Gold members earn 2 points per SGD plus 1x free 10ml for each product launch." },
    { q: "Does my membership status expire?", a: "Your points reset every 2 years from signup date. However, your membership tier will be maintained as long as you meet the minimum required points within each new 2-year period." },
    { q: "How do I check my points balance?", a: "Visit the Loyalty page on our website after completing a purchase. Your points and current tier are displayed on your profile." },
  ],
  Other: [
    { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayNow and GrabPay via Stripe Checkout." },
    { q: "Can I return or exchange a product?", a: "Due to the nature of fragrance products, we do not accept returns for change-of-mind purchases. However, if your product arrives damaged or defective, please contact us within 7 days of delivery and we will make it right." },
    { q: "How do I contact Youthentic Singapore?", a: "You can reach us via the contact form on our website or email us at sg@youthentic.com. We typically respond within 1–2 business days." },
    { q: "Is this an official Youthentic store?", a: "Yes — this is the official Youthentic Singapore store, operated in partnership with the Youthentic brand. Our Indonesia flagship site is at youthentic.vercel.app." },
  ],
};

const FAQ = () => {
  const [activeTab,  setActiveTab]  = useState("Product");
  const [openIndex,  setOpenIndex]  = useState(null);

  const questions = FAQ_DATA[activeTab] ?? [];

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="ab-faq">
      <div className="ab-faq__header">
        <p className="ab-faq__eyebrow">Got Questions?</p>
        <h2 className="ab-faq__title">FREQUENTLY<br /><span>ASKED.</span></h2>
      </div>

      <div className="ab-faq__tabs">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`ab-faq__tab${activeTab === cat ? " active" : ""}`}
            onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="ab-faq__list">
        {questions.map((item, i) => (
          <div key={i} className={`ab-faq__item${openIndex === i ? " open" : ""}`}>
            <div className="ab-faq__question" onClick={() => toggle(i)}>
              <span className="ab-faq__q-text">{item.q}</span>
              <span className="ab-faq__chevron">▾</span>
            </div>
            {openIndex === i && (
              <div className="ab-faq__answer">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const BrandStory = () => {
  const [openPillar, setOpenPillar] = useState(null);
  const location = useLocation();
  useReveal();

  useEffect(() => {
    if (location.hash === "#faq") {
      setTimeout(() => {
        const faqElement = document.getElementById("faq");
        if (faqElement) {
          faqElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  const togglePillar = (i) => setOpenPillar((prev) => (prev === i ? null : i));

  return (
    <>
      <style>{css}</style>

      {/* HERO */}
      <section className="ab-hero">
        <div className="ab-hero__wordmark" aria-hidden="true"><span>YOUTHENTIC</span></div>
        <div className="ab-hero__rule" aria-hidden="true" />
        <div className="ab-hero__glow" aria-hidden="true" />
        <div className="ab-hero__content">
          <p className="ab-hero__eyebrow">Formulated in Barcelona · Refined for Singapore</p>
          <h1 className="ab-hero__title">More than a<br /><em>fragrance.</em></h1>
          <p className="ab-hero__sub">
            Discover the philosophy, the people, and the passion behind
            Southeast Asia's most authentic pocket-sized luxury.
          </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="ab-manifesto">
        <div className="ab-manifesto__label reveal">Manifesto</div>
        <blockquote className="reveal">
          <p className="ab-manifesto__text">
            We started with a simple belief: <em>authenticity has many scents,</em>{" "}
            and all of them are worth celebrating.
            Bold Southeast Asian creativity meets{" "}
            <strong>global sophistication</strong> — not as a compromise,
            but as a statement.
          </p>
        </blockquote>
      </section>

      {/* PILLARS */}
      <section className="ab-pillars">
        <div className="ab-pillars__header reveal">
          <h2 className="ab-pillars__title">WHAT WE<br /><span>STAND FOR</span></h2>
          <p className="ab-pillars__intro">
            Three pillars form the foundation of every bottle,
            every scent, every experience we create.
          </p>
        </div>
        {PILLARS.map((p, i) => (
          <div
            key={p.num}
            className="ab-pillar reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
            onClick={() => togglePillar(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && togglePillar(i)}
            aria-expanded={openPillar === i}
          >
            <div className="ab-pillar__num">{p.num}</div>
            <div className="ab-pillar__body">
              <span className="ab-pillar__tag">{p.tag}</span>
              <h3 className="ab-pillar__name">{p.name}</h3>
              <p className={`ab-pillar__text${openPillar === i ? " open" : ""}`}>{p.text}</p>
            </div>
            <div className={`ab-pillar__expand${openPillar === i ? " open" : ""}`}>+</div>
          </div>
        ))}
      </section>

      {/* SPLIT: ORIGIN + TIMELINE */}
      <section className="ab-split">
        <div className="ab-split__left reveal-left">
          <p className="ab-split__eyebrow">Where We Come From</p>
          <h2 className="ab-split__title">Born in the<br /><em>archipelago.</em></h2>
          <p className="ab-split__body">
            Youthentic was founded in Indonesia — a nation whose spice trade routes shaped
            world history. That same heritage of rare botanicals and bold craftsmanship
            lives in every bottle we produce.
          </p>
          <div className="ab-split__stat">
            <div>
              <div className="ab-split__stat-num">8+</div>
              <div className="ab-split__stat-label">Signature Scents</div>
            </div>
            <div>
              <div className="ab-split__stat-num">8H</div>
              <div className="ab-split__stat-label">Avg Longevity</div>
            </div>
            <div>
              <div className="ab-split__stat-num">10ml</div>
              <div className="ab-split__stat-label">Travel-Ready</div>
            </div>
          </div>
        </div>

        <div className="ab-split__right reveal-right">
          <p className="ab-split__eyebrow">Our Journey</p>
          <div className="ab-timeline">
            {[
              { year: "2021", filled: false, title: "Founded", desc: "Youthentic launches in Indonesia with three signature scents and a bold vision." },
              { year: "2023", filled: false, title: "Barcelona Sourcing", desc: "We establish ingredient partnerships with premium European suppliers." },
              { year: "2024", filled: false, title: "Lite Line Launches", desc: "Youthentic Lite redefines pocket-sized luxury fragrance." },
              { year: "2025", filled: true,  title: "Singapore Arrives", desc: "We bring the full collection to Singapore — crafted for this city's pace and heat." },
            ].map((t) => (
              <div key={t.year} className="ab-timeline__item">
                <div className={`ab-timeline__dot${t.filled ? " filled" : ""}`} />
                <div className="ab-timeline__year">{t.year}</div>
                <div className="ab-timeline__text">
                  <strong>{t.title}</strong>{t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SG STRIP */}
      <section className="ab-sg">
        <blockquote className="ab-sg__quote reveal-left">
          "Singapore moves fast. Your scent should keep up — without the bulk,
          the price, or the compromise."
          <cite>— Youthentic SG, 2025</cite>
        </blockquote>
        <div className="ab-sg__right reveal-right">
          <p className="ab-sg__label">Why Singapore</p>
          <h2 className="ab-sg__title">Built for this city.</h2>
          <p className="ab-sg__body">
            Our formula is heat-tested and humidity-stable — because Singapore's
            climate demands a fragrance that lasts from the MRT to the rooftop.
            Pocket-sized, compliant, and designed for the Singaporean on the move.
          </p>
          <div className="ab-sg__tags">
            {["Humidity-Stable", "MRT-Friendly", "Office-Safe", "Travel-Ready", "SGD Priced"].map((t) => (
              <span key={t} className="ab-sg__tag">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="ab-identity">
        <p className="ab-identity__label reveal">Our Identity</p>
        <h2 className="ab-identity__title reveal">
          A presence in every<br />aspect of your <em>life.</em>
        </h2>
        <p className="ab-identity__body reveal">
          It's not just a perfume — it's a presence. Whether it's raining, amidst
          the hustle and bustle of the city, or relaxing with friends, Youthentic
          was created to complement every personality and preference.
          Because authenticity has many scents, and all of them are worth celebrating.
        </p>
        <div className="ab-identity__contexts reveal">
          {[
            { icon: "🌧️", label: "Rainy Days" },
            { icon: "🏙️", label: "City Rush" },
            { icon: "🤝", label: "With Friends" },
            { icon: "💼", label: "The Office" },
            { icon: "✈️", label: "Travelling" },
          ].map((c) => (
            <div key={c.label} className="ab-identity__context">
              <span className="ab-identity__context-icon">{c.icon}</span>
              <span className="ab-identity__context-label">{c.label}</span>
            </div>
          ))}
        </div>
        <Link to="/products" className="yt-btn-yellow reveal">Find Your Scent →</Link>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default BrandStory;
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const assetUrl = (fileName) => `${process.env.PUBLIC_URL || ""}/assets/${encodeURIComponent(fileName)}`;

/* ─── INJECT GLOBAL STYLES ─────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Jost', sans-serif;
    overflow-x: hidden;
  }

  /* ─── NAVBAR ──────────────────────────────────────────────────── */
  .yt-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 3rem;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%);
    backdrop-filter: blur(0px);
    transition: background 0.4s, backdrop-filter 0.4s;
  }
  .yt-nav.scrolled {
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .yt-nav__logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.15em;
    color: var(--white);
    text-decoration: none;
  }

  .yt-nav__links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
  }
  .yt-nav__links a {
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    transition: color 0.2s;
  }
  .yt-nav__links a:hover { color: var(--white); }

  .yt-nav__cta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--yellow);
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    border: none;
    padding: 0.6rem 1.4rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
  }
  .yt-nav__cta:hover { background: var(--gold2); transform: scale(1.03); }

  /* ─── HERO ────────────────────────────────────────────────────── */
  .yt-hero {
    position: relative;
    width: 100%;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--black);
  }

  /* giant ghosted wordmark behind everything */
  .yt-hero__wordmark {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    gap: 0;
    line-height: 0.82;
  }
  .yt-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(10rem, 22vw, 20rem);
    letter-spacing: 0.02em;
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.18);
    opacity: 0;
    transform: translateY(30px);
    animation: fadeUp 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .yt-hero__wordmark span:nth-child(1) { animation-delay: 0.1s; }
  .yt-hero__wordmark span:nth-child(2) { animation-delay: 0.25s; }

  /* radial glow behind product */
  .yt-hero__glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,130,40,0.22) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    animation: glowPulse 4s ease-in-out infinite alternate;
  }

  /* product stage */
  .yt-hero__stage {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    opacity: 0;
    transform: translateY(40px);
    animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards 0.5s;
  }

  /* SVG perfume pen cluster */
  .yt-hero__bottles {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 6px;
    margin-bottom: -8px;
    position: relative;
    z-index: 2;
  }

  .yt-bottle-svg {
    filter: drop-shadow(0 20px 60px rgba(201,168,76,0.3));
    transition: transform 0.4s ease;
  }
  .yt-bottle-svg:hover { transform: translateY(-8px) scale(1.02); }

  /* wooden pedestal */
  .yt-hero__pedestal {
    position: relative;
    z-index: 1;
  }

  /* floating info card */
  .yt-hero__card {
    position: absolute;
    left: -200px;
    top: 20%;
    background: rgba(10,10,10,0.85);
    border: 1px solid var(--border);
    padding: 1.2rem 1.5rem;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateX(-20px);
    animation: fadeRight 0.9s ease forwards 1.2s;
    min-width: 180px;
  }
  .yt-hero__card-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }
  .yt-hero__card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--white);
    margin-bottom: 0.25rem;
  }
  .yt-hero__card-sub {
    font-size: 0.75rem;
    color: var(--gold);
    font-style: italic;
  }

  /* bottom hero text */
  .yt-hero__bottom {
    position: absolute;
    bottom: 4rem;
    left: 0; right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 3rem;
    z-index: 4;
  }

  .yt-hero__tagline {
    opacity: 0;
    transform: translateY(16px);
    animation: fadeUp 0.9s ease forwards 0.9s;
  }
  .yt-hero__tagline p {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    line-height: 1.8;
    display: inline-block;
    padding: 0.65rem 0.9rem;
    background: rgba(0,0,0,0.42);
    border: 1px solid rgba(201,168,76,0.2);
    text-shadow: 0 1px 1px rgba(0,0,0,0.55);
  }
  .yt-hero__tagline strong {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 300;
    font-style: italic;
    color: var(--white);
    letter-spacing: 0.05em;
  }

  .yt-hero__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
    opacity: 0;
    animation: fadeUp 0.9s ease forwards 1.1s;
  }

  .yt-btn-yellow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--yellow);
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.15s;
  }
  .yt-btn-yellow:hover { background: var(--gold2); transform: translateY(-2px); }

  .yt-btn-ghost {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
  }
  .yt-btn-ghost:hover { color: var(--white); }

  /* scroll caret */
  .yt-hero__scroll {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 1.5s;
    cursor: pointer;
  }
  .yt-hero__scroll span {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .yt-scroll-caret {
    width: 20px;
    height: 20px;
    border-right: 1px solid var(--muted);
    border-bottom: 1px solid var(--muted);
    transform: rotate(45deg);
    animation: caretBounce 1.6s ease-in-out infinite;
  }

  /* ─── MARQUEE ─────────────────────────────────────────────────── */
  .yt-marquee {
    background: var(--gold);
    padding: 0.65rem 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .yt-marquee__track {
    display: inline-flex;
    gap: 3rem;
    animation: marquee 20s linear infinite;
  }
  .yt-marquee__item {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.15em;
    color: var(--black);
    flex-shrink: 0;
  }
  .yt-marquee__dot {
    color: rgba(0,0,0,0.4);
    margin: 0 0.5rem;
  }

  /* ─── ABOUT STRIP ─────────────────────────────────────────────── */
  .yt-about {
    background: var(--dark);
    padding: 8rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }

  .yt-about__label {
    font-size: 0.68rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.5rem;
  }

  .yt-about__headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 4vw, 4rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--white);
    margin-bottom: 2rem;
  }
  .yt-about__headline em {
    font-style: italic;
    color: var(--gold);
  }

  .yt-about__body {
    font-size: 0.9rem;
    line-height: 1.9;
    color: var(--muted);
    max-width: 40ch;
    margin-bottom: 2.5rem;
  }

  .yt-about__stats {
    display: flex;
    gap: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }
  .yt-about__stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    letter-spacing: 0.05em;
    color: var(--gold);
    line-height: 1;
  }
  .yt-about__stat-label {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 0.25rem;
  }

  .yt-about__right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
  }
  .yt-about__pillar {
    background: var(--dark);
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: background 0.3s;
  }
  .yt-about__pillar:hover { background: var(--panel); }
  .yt-about__pillar-icon {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }
  .yt-about__pillar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--white);
  }
  .yt-about__pillar-text {
    font-size: 0.8rem;
    line-height: 1.7;
    color: var(--muted);
  }

  /* ─── FEATURED SCENTS ─────────────────────────────────────────── */
  .yt-scents {
    background: var(--black);
    padding: 8rem 3rem;
  }

  .yt-scents__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 4rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2rem;
  }

  .yt-scents__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 6rem);
    letter-spacing: 0.04em;
    color: var(--white);
    line-height: 1;
  }
  .yt-scents__title span { color: var(--gold); }

  .yt-scents__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
  }

  .yt-scent-card {
    background: var(--black);
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .yt-scent-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }
  .yt-scent-card:hover { background: var(--panel); }
  .yt-scent-card:hover::after { transform: scaleX(1); }

  .yt-scent-card__tag {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .yt-scent-card__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--white);
    line-height: 1.2;
  }

  .yt-scent-card__notes {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.7;
    font-style: italic;
    flex: 1;
  }

  .yt-scent-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .yt-scent-card__price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: var(--gold);
  }

  .yt-scent-card__add {
    width: 2.2rem;
    height: 2.2rem;
    border: 1px solid var(--gold);
    background: transparent;
    color: var(--gold);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    border-radius: 2px;
  }
  .yt-scent-card__add:hover { background: var(--gold); color: var(--black); }

  /* ─── SG DELIVERY BANNER ──────────────────────────────────────── */
  .yt-delivery {
    background: var(--panel);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 5rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .yt-delivery__flag { font-size: 2.5rem; margin-bottom: 1rem; }

  .yt-delivery__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 300;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  .yt-delivery__title strong { color: var(--gold); font-weight: 400; }

  .yt-delivery__perks {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .yt-delivery__perk {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .yt-delivery__perk-icon { color: var(--gold); font-size: 1rem; width: 1.2rem; }

  .yt-delivery__right {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .yt-delivery__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
    transition: border-color 0.3s;
  }
  .yt-delivery__badge:hover { border-color: var(--gold); }
  .yt-delivery__badge-icon { font-size: 1.5rem; }
  .yt-delivery__badge-text { font-size: 0.8rem; line-height: 1.5; color: var(--muted); }
  .yt-delivery__badge-text strong { display: block; color: var(--white); font-size: 0.88rem; }

  /* ─── LOYALTY TEASER ──────────────────────────────────────────── */
  .yt-loyalty {
    background: var(--dark);
    padding: 8rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    border-top: 1px solid var(--border);
  }

  .yt-loyalty__label {
    font-size: 0.68rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.5rem;
  }

  .yt-loyalty__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 3.5rem);
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }

  .yt-loyalty__body {
    font-size: 0.88rem;
    line-height: 1.85;
    color: var(--muted);
    margin-bottom: 2.5rem;
  }

  .yt-loyalty__tiers {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }

  .yt-loyalty__tier {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .yt-loyalty__tier:last-child { border-bottom: none; }
  .yt-loyalty__tier:hover { background: var(--panel); }

  .yt-loyalty__tier-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .yt-tier-bronze { background: #cd7f32; box-shadow: 0 0 8px rgba(205,127,50,0.5); }
  .yt-tier-silver { background: #a8a9ad; box-shadow: 0 0 8px rgba(168,169,173,0.5); }
  .yt-tier-gold   { background: var(--gold); box-shadow: 0 0 8px rgba(201,168,76,0.5); }

  .yt-loyalty__tier-info { flex: 1; }
  .yt-loyalty__tier-name {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--white);
    letter-spacing: 0.05em;
  }
  .yt-loyalty__tier-pts {
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 0.15rem;
  }
  .yt-loyalty__tier-benefit {
    font-size: 0.72rem;
    color: var(--gold);
    text-align: right;
  }

  /* orbital ring visual */
  .yt-loyalty__visual {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    height: 380px;
    gap: 1.5rem;
  }

  .yt-loyalty__podium {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    justify-content: center;
  }

  .yt-loyalty__tier-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    background: linear-gradient(to top, rgba(201,168,76,0.08), transparent);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2rem 2.5rem;
    min-width: 100px;
    transition: all 0.3s ease;
    position: relative;
  }

  .yt-loyalty__tier-col:hover {
    background: linear-gradient(to top, rgba(201,168,76,0.15), rgba(201,168,76,0.05));
    border-color: rgba(201,168,76,0.3);
  }

  .yt-loyalty__tier-col--active {
    background: linear-gradient(to top, rgba(201,168,76,0.2), rgba(201,168,76,0.08));
    border-color: var(--gold);
    box-shadow: 0 0 20px rgba(201,168,76,0.2);
    transform: scale(1.05);
  }

  .yt-loyalty__tier-col--active:hover {
    background: linear-gradient(to top, rgba(201,168,76,0.25), rgba(201,168,76,0.12));
  }

  .yt-loyalty__tier-col-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .yt-loyalty__tier-col-dot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .yt-loyalty__tier-col-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--white);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .yt-loyalty__tier-col-pts {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    color: var(--gold);
    letter-spacing: 0.06em;
    line-height: 1;
  }

  /* ─── FOOTER STRIP ────────────────────────────────────────────── */
  .yt-footer {
    background: var(--black);
    border-top: 1px solid var(--border);
    padding: 2rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .yt-footer__brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 0.2em;
    color: var(--gold);
  }

  .yt-footer__links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  .yt-footer__links a {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
    text-transform: uppercase;
  }
  .yt-footer__links a:hover { color: var(--gold); }

  .yt-footer__copy {
    font-size: 0.72rem;
    color: rgba(136,136,136,0.5);
    letter-spacing: 0.05em;
  }

  /* ─── KEYFRAMES ───────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes glowPulse {
    from { opacity: 0.6; transform: translate(-50%,-50%) scale(0.95); }
    to   { opacity: 1;   transform: translate(-50%,-50%) scale(1.05); }
  }
  @keyframes caretBounce {
    0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.5; }
    50%       { transform: rotate(45deg) translateY(4px); opacity: 1; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ─── RESPONSIVE ──────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .yt-nav { padding: 1rem 1.5rem; }
    .yt-nav__links { display: none; }
    .yt-hero__card { display: none; }
    .yt-hero__bottom { padding: 0 1.5rem; flex-direction: column; align-items: center; gap: 1.5rem; bottom: 3rem; }
    .yt-hero__actions { align-items: center; }
    .yt-about { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 3rem; }
    .yt-about__right { grid-template-columns: 1fr; }
    .yt-scents { padding: 4rem 1.5rem; }
    .yt-scents__grid { grid-template-columns: 1fr; }
    .yt-scents__header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
    .yt-delivery { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 2.5rem; }
    .yt-loyalty { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 3rem; }
    .yt-loyalty__visual { height: auto; }
    .yt-loyalty__podium { gap: 1rem; }
    .yt-loyalty__tier-col { padding: 1.5rem 1.5rem; min-width: 80px; }
    .yt-loyalty__tier-col-label { font-size: 0.8rem; }
    .yt-loyalty__tier-col-pts { font-size: 0.95rem; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; }
  }
`;

/* ─── SAMPLE SCENT DATA ─────────────────────────────────────────── */
const SCENTS = [
  {
    id: 1,
    tag: "Signature",
    name: "Gentleman Choice",
    notes: "Bergamot · Cedarwood · Amber · White Musk",
    desc: "Inspired by Barcelona evenings — bold, composed, unforgettable.",
    price: "SGD 38",
    priceNum: 38,
  },
  {
    id: 2,
    tag: "Tropical",
    name: "Garden of Eden",
    notes: "Neroli · Jasmine · Vetiver · Sandalwood",
    desc: "The lush warmth of the tropics, captured in every spray.",
    price: "SGD 38",
    priceNum: 38,
  },
  {
    id: 3,
    tag: "Fresh",
    name: "Aqua Libre",
    notes: "Sea Salt · Grapefruit · Driftwood · Oakmoss",
    desc: "Clean coastal air meets confident sophistication.",
    price: "SGD 38",
    priceNum: 38,
  },
];

const MARQUEE_ITEMS = [
  "FORMULATED IN BARCELONA",
  "REFINED FOR SINGAPORE",
  "YOUTHENTIC LITE",
  "LONG-LASTING FORMULA",
  "POCKET-SIZED LUXURY",
  "FORMULATED IN BARCELONA",
  "REFINED FOR SINGAPORE",
  "YOUTHENTIC LITE",
  "LONG-LASTING FORMULA",
  "POCKET-SIZED LUXURY",
];

/* ─── BOTTLE SVG ────────────────────────────────────────────────── */
const BottleSVG = ({ capColor = "#4FC3F7", height = 220 }) => (
  <svg
    className="yt-bottle-svg"
    width={height * 0.32}
    height={height}
    viewBox="0 0 64 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* cap */}
    <rect x="22" y="0" width="20" height="10" rx="3" fill={capColor} />
    {/* neck */}
    <rect x="26" y="10" width="12" height="20" fill="#1a1a1a" />
    {/* body */}
    <rect x="8" y="30" width="48" height="175" rx="4" fill="#1c1c1c" />
    {/* body sheen */}
    <rect x="10" y="32" width="6" height="169" rx="2" fill="rgba(255,255,255,0.06)" />
    {/* label area */}
    <rect x="10" y="80" width="44" height="90" rx="2" fill="#141414" />
    {/* label text lines (decorative) */}
    <text
      x="32"
      y="130"
      textAnchor="middle"
      transform="rotate(90,32,130)"
      fill="rgba(255,255,255,0.5)"
      fontSize="7"
      fontFamily="sans-serif"
      letterSpacing="2"
    >
      YOUTHENTIC LITE
    </text>
    {/* bottom shine */}
    <rect x="8" y="196" width="48" height="9" rx="2" fill="rgba(255,255,255,0.04)" />
  </svg>
);

/* ─── PEDESTAL SVG ──────────────────────────────────────────────── */
const PedestalSVG = () => (
  <svg width="340" height="70" viewBox="0 0 340 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="170" cy="35" rx="165" ry="32" fill="url(#woodGrad)" />
    <ellipse cx="170" cy="22" rx="165" ry="20" fill="url(#woodTop)" />
    <defs>
      <radialGradient id="woodTop" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#8B5E3C" />
        <stop offset="60%" stopColor="#6B4226" />
        <stop offset="100%" stopColor="#4A2C18" />
      </radialGradient>
      <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6B4226" />
        <stop offset="100%" stopColor="#2C1A0E" />
      </linearGradient>
    </defs>
  </svg>
);

const TIER_ICONS = {
  Bronze: assetUrl("Bronze.png"),
  Silver: assetUrl("Silver.png"),
  Gold: assetUrl("Gold.png"),
};

/* ─── HOME COMPONENT ────────────────────────────────────────────── */
const Home = () => {
  const [addedIds, setAddedIds] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const scentsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = (scent) => {
    // Replace with: const { addToCart } = useCart(); addToCart(scent);
    setAddedIds((prev) => [...prev, scent.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== scent.id)), 1800);
  };

  const scrollToScents = () => navigate("/products");

  return (
    <>
      {/* inject styles */}
      <style>{css}</style>



      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="yt-hero">
        {/* ghost wordmark */}
        <div className="yt-hero__wordmark" aria-hidden="true">
          <span>YOUTH</span>
          <span>ENTIC</span>
        </div>

        {/* radial glow */}
        <div className="yt-hero__glow" aria-hidden="true" />

        {/* product + pedestal */}
        <div className="yt-hero__stage">
          {/* floating info card */}
          <div className="yt-hero__card">
            <div className="yt-hero__card-label">Signature Scent</div>
            <div className="yt-hero__card-name">Gentleman Choice</div>
            <div className="yt-hero__card-sub">Essence from Barcelona</div>
          </div>

          <div className="yt-hero__bottles">
            <BottleSVG capColor="#4FC3F7" height={200} />
            <BottleSVG capColor="#CDDC39" height={220} />
            <BottleSVG capColor="#1c1c1c" height={215} />
            <BottleSVG capColor="#FF8A80" height={205} />
          </div>
          <div className="yt-hero__pedestal">
            <PedestalSVG />
          </div>
        </div>

        {/* bottom bar */}
        <div className="yt-hero__bottom">
          <div className="yt-hero__tagline">
            <p>Crafted in Indonesia — Refined for Singapore.</p>
          </div>
          <div className="yt-hero__actions">
            <button className="yt-btn-yellow" onClick={scrollToScents}>
              Explore Scents →
            </button>
            
          </div>
        </div>

        {/* scroll caret */}
        
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────── */}
      <div className="yt-marquee" aria-hidden="true">
        <div className="yt-marquee__track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="yt-marquee__item">
              {item}
              <span className="yt-marquee__dot"> ✦ </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT STRIP ───────────────────────────────────────────── */}
      <section className="yt-about">
        <div>
          <p className="yt-about__label">Our Story</p>
          <h2 className="yt-about__headline">
            Born from the <em>archipelago</em>,<br />made for your city.
          </h2>
          <p className="yt-about__body">
            Youthentic Fragrances bridges the lush heritage of Indonesian perfumery with
            the fast-paced, discerning lifestyle of Singapore. Every scent is pocket-sized,
            long-lasting, and crafted to move with you — MRT to rooftop.
          </p>
          <Link to="/products" className="yt-btn-yellow">Shop All Scents</Link>
          <div className="yt-about__stats">
            <div>
              <div className="yt-about__stat-num">8+</div>
              <div className="yt-about__stat-label">Signature Scents</div>
            </div>
            <div>
              <div className="yt-about__stat-num">8H</div>
              <div className="yt-about__stat-label">Avg. Longevity</div>
            </div>
            <div>
              <div className="yt-about__stat-num">SG</div>
              <div className="yt-about__stat-label">Delivered Fast</div>
            </div>
          </div>
        </div>

        <div className="yt-about__right">
          {[
            { icon: "🌿", title: "Natural Ingredients", text: "High-quality ingredients carefully selected from Barcelona to create the perfect scent." },
            { icon: "✈️", title: "Travel-Ready", text: "Compact 10ml size fits any bag, pocket, or carry-on." },
            { icon: "💧", title: "Long-Lasting", text: "Premium formula designed for Singapore's humid climate." },
            { icon: "🇸🇬", title: "SG Delivery", text: "Same-week delivery islandwide." },
          ].map((p) => (
            <div key={p.title} className="yt-about__pillar">
              <div className="yt-about__pillar-icon">{p.icon}</div>
              <div className="yt-about__pillar-title">{p.title}</div>
              <div className="yt-about__pillar-text">{p.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SG DELIVERY ───────────────────────────────────────────── */}
      <section className="yt-delivery">
        <div>
          <div className="yt-delivery__flag">🇸🇬</div>
          <h2 className="yt-delivery__title">
            Now delivering<br />across <strong>Singapore.</strong>
          </h2>
          <div className="yt-delivery__perks">
            {[
              { icon: "🚚", text: "Free delivery on orders above SGD 50" },
              { icon: "⚡", text: "3-5 Business days" },
              { icon: "📦", text: "Secure, elegant packaging" },
              { icon: "↩️", text: "7-day returns if damaged" },
            ].map((p) => (
              <div key={p.text} className="yt-delivery__perk">
                <span className="yt-delivery__perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="yt-delivery__right">
          {[
            { icon: "💳", title: "Pay with Stripe", text: "Visa, Mastercard & more accepted" },
            { icon: "🔒", title: "Secure Checkout", text: "SSL encrypted · Your data stays private" },
            { icon: "🌐", title: "SGD Pricing", text: "No hidden FX fees · Local prices" },
          ].map((b) => (
            <div key={b.title} className="yt-delivery__badge">
              <span className="yt-delivery__badge-icon">{b.icon}</span>
              <div className="yt-delivery__badge-text">
                <strong>{b.title}</strong>
                {b.text}
              </div>
            </div>
          ))}
          <Link to="/products" className="yt-btn-yellow" style={{ alignSelf: "flex-start" }}>
            Shop Now →
          </Link>
        </div>
      </section>

      {/* ── LOYALTY ───────────────────────────────────────────────── */}
      <section className="yt-loyalty">
        <div className="yt-loyalty__content">
          <p className="yt-loyalty__label">Loyalty Programme</p>
          <h2 className="yt-loyalty__title">
            Earn points.<br />Smell better.
          </h2>
          <p className="yt-loyalty__body">
            Every SGD spent earns you Youthentic points. Upgrade tiers for free bottles,
            exclusive drops, and early access to limited editions.
          </p>
          <div className="yt-loyalty__tiers">
            {[
              { dot: "yt-tier-bronze", name: "Bronze", pts: "0 – 119 pts", benefit: "Free Sample w/ every purchase" },
              { dot: "yt-tier-silver", name: "Silver", pts: "120 – 499 pts", benefit: "Early Sales Access to new releases" },
              { dot: "yt-tier-gold",   name: "Gold",   pts: "500+ pts",     benefit: "10% Exclusive Discount on all orders" },
            ].map((t) => (
              <div key={t.name} className="yt-loyalty__tier">
                <div className={`yt-loyalty__tier-dot ${t.dot}`} />
                <div className="yt-loyalty__tier-info">
                  <div className="yt-loyalty__tier-name">{t.name}</div>
                  <div className="yt-loyalty__tier-pts">{t.pts}</div>
                </div>
                <div className="yt-loyalty__tier-benefit">{t.benefit}</div>
              </div>
            ))}
          </div>
          <Link to="/loyalty" className="yt-btn-yellow" style={{ alignSelf: "flex-start" }}>
            Join the Programme →
          </Link>
        </div>

        {/* tier progression visual */}
        <div className="yt-loyalty__visual">
          <div className="yt-loyalty__podium">
            {/* Bronze */}
            <div className="yt-loyalty__tier-col" style={{ height: "160px" }}>
              <div className="yt-loyalty__tier-col-dot">
                <img src={TIER_ICONS.Bronze} alt="Bronze" />
              </div>
              <div className="yt-loyalty__tier-col-label">Bronze</div>
              <div className="yt-loyalty__tier-col-pts">0–119</div>
            </div>
            {/* Silver */}
            <div className="yt-loyalty__tier-col" style={{ height: "220px" }}>
              <div className="yt-loyalty__tier-col-dot">
                <img src={TIER_ICONS.Silver} alt="Silver" />
              </div>
              <div className="yt-loyalty__tier-col-label">Silver</div>
              <div className="yt-loyalty__tier-col-pts">120–499</div>
            </div>
            {/* Gold (highlighted) */}
            <div className="yt-loyalty__tier-col yt-loyalty__tier-col--active" style={{ height: "280px" }}>
              <div className="yt-loyalty__tier-col-dot">
                <img src={TIER_ICONS.Gold} alt="Gold" />
              </div>
              <div className="yt-loyalty__tier-col-label">Gold</div>
              <div className="yt-loyalty__tier-col-pts">500+</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Home;
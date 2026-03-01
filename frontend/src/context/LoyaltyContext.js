import { createContext, useContext, useState, useCallback } from "react";
import API from "../api/api";

const LoyaltyContext = createContext();
export const useLoyalty = () => useContext(LoyaltyContext);

/* ── TIER CONFIG ────────────────────────────────────────────────────
   Thresholds match your Supabase users.tier column values exactly.
   Points are plain integers — 1 point per SGD spent.
───────────────────────────────────────────────────────────────────── */
export const TIERS = [
  {
    name:        "Bronze",
    min:         0,
    max:         499,
    multiplier:  1,
    discount:    0,
    color:       "#cd7f32",
    borderColor: "rgba(205,127,50,0.4)",
    benefits: [
      "1× points on every purchase",
      "Birthday bonus points",
      "Access to member-only drops",
    ],
  },
  {
    name:        "Silver",
    min:         500,
    max:         1999,
    multiplier:  1.5,
    discount:    0,
    color:       "#a8a9ad",
    borderColor: "rgba(168,169,173,0.4)",
    benefits: [
      "1.5× points on every purchase",
      "Early access to new releases",
      "Free shipping on all orders",
      "Birthday bonus points",
    ],
  },
  {
    name:        "Gold",
    min:         2000,
    max:         null,
    multiplier:  2,
    discount:    0.10,
    color:       "#C9A84C",
    borderColor: "rgba(201,168,76,0.5)",
    benefits: [
      "2× points on every purchase",
      "10% exclusive discount on all orders",
      "Priority early access to all releases",
      "Free express shipping",
      "Dedicated Gold member support",
    ],
  },
];

export const getTierByName   = (name) => TIERS.find((t) => t.name === name) ?? TIERS[0];
export const getTierByPoints = (pts)  => TIERS.slice().reverse().find((t) => pts >= t.min) ?? TIERS[0];
export const getNextTier     = (pts)  => {
  const idx = TIERS.findIndex((t) => t.name === getTierByPoints(pts).name);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
};

export const LoyaltyProvider = ({ children }) => {
  const [points,  setPoints]  = useState(0);
  const [email,   setEmail]   = useState(null);
  const [loading, setLoading] = useState(false);

  // Derived from points — single source of truth
  const tierData = getTierByPoints(points);
  const nextTier = getNextTier(points);
  const tier     = tierData.name; // string, matches DB column

  /* ── FETCH from backend ────────────────────────────────────────── */
  const fetchLoyalty = useCallback(async (userEmail) => {
    if (!userEmail) return;
    setEmail(userEmail);
    setLoading(true);
    try {
      const res = await API.get(`/users/loyalty?email=${encodeURIComponent(userEmail)}`);
      setPoints(res.data.loyalty_points ?? 0);
    } catch (e) {
      console.error("Loyalty fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── EARN points (call after successful Stripe payment) ─────────
     amount = SGD value of order (e.g. 38.00)
     Applies tier multiplier, then persists to backend.
  ─────────────────────────────────────────────────────────────────── */
  const earnPoints = useCallback(async (amount) => {
    const base    = Math.floor(amount);                       // 1 pt per SGD
    const earned  = Math.floor(base * tierData.multiplier);  // apply multiplier
    const newTotal = points + earned;

    // Optimistic update
    setPoints(newTotal);

    // Derive new tier from new total
    const newTierName = getTierByPoints(newTotal).name;

    if (email) {
      try {
        await API.post("/users/loyalty/earn", {
          email,
          points_to_add: earned,
          new_total:     newTotal,
          new_tier:      newTierName,
        });
      } catch (e) {
        console.error("Loyalty earn failed", e);
        setPoints(points); // rollback on error
      }
    }

    return earned;
  }, [points, tierData.multiplier, email]);

  /* ── REDEEM points ─────────────────────────────────────────────── */
  const redeemPoints = useCallback(async (pointsToRedeem) => {
    if (pointsToRedeem > points) return false;
    const newTotal = points - pointsToRedeem;
    setPoints(newTotal);

    if (email) {
      try {
        await API.post("/users/loyalty/redeem", {
          email,
          points_to_redeem: pointsToRedeem,
          new_total:        newTotal,
          new_tier:         getTierByPoints(newTotal).name,
        });
      } catch (e) {
        console.error("Loyalty redeem failed", e);
        setPoints(points); // rollback
        return false;
      }
    }
    return true;
  }, [points, email]);

  return (
    <LoyaltyContext.Provider value={{
      points,
      tier,
      tierData,
      nextTier,
      email,
      loading,
      fetchLoyalty,
      earnPoints,
      redeemPoints,
      TIERS,
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
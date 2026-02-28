import { createContext, useContext, useState } from "react";

const LoyaltyContext = createContext();
export const useLoyalty = () => useContext(LoyaltyContext);

export const LoyaltyProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  const earnPoints = (amount) => {
    setPoints(prev => prev + Math.floor(amount / 100));
  };

  const tier =
    points > 2000
      ? "Gold"
      : points > 1000
      ? "Silver"
      : "Bronze";

  return (
    <LoyaltyContext.Provider value={{ points, tier, earnPoints }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
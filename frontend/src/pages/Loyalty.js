import { useLoyalty } from "../context/LoyaltyContext";

const Loyalty = () => {
  const { points, tier } = useLoyalty();

  return (
    <div className="page">
      <h1>Loyalty Program</h1>

      <h2>Current Tier: {tier}</h2>
      <p>Total Points: {points}</p>

      <h3>Tier Benefits</h3>
      <ul>
        <li><strong>Bronze:</strong> 1x points on purchases</li>
        <li><strong>Silver:</strong> Early access to new releases</li>
        <li><strong>Gold:</strong> 10% exclusive discount</li>
      </ul>

      {tier !== "Gold" && (
        <p>
          Spend more to unlock the next tier!
        </p>
      )}
    </div>
  );
};

export default Loyalty;
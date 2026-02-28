import { useState } from "react";

const ScentQuiz = () => {
  const [result, setResult] = useState("");

  const handleAnswer = (type) => {
    if (type === "fresh") setResult("Try our Aqua Series.");
    if (type === "bold") setResult("Try Oud Intense.");
  };

  return (
    <div className="page">
      <h1>Scent Finder Quiz</h1>
      <button onClick={() => handleAnswer("fresh")}>
        I like Fresh scents
      </button>
      <button onClick={() => handleAnswer("bold")}>
        I like Bold scents
      </button>
      <h2>{result}</h2>
    </div>
  );
};

export default ScentQuiz;
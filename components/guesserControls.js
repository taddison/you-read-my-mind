import React, { useRef } from "react";
import { ApiRoutes } from "../consts";
import { mutate } from "swr";

const GuesserControls = ({ roundState }) => {
  const guessedScore = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/setGuessedScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guesedScore: guessedScore.current.value,
      }),
    });
    mutate(ApiRoutes.GetGameState);
  };

  return (
    <div>
      {roundState === "Guessing" && (
        <form onSubmit={handleSubmit}>
          <label>Enter your score (-15 to 15)</label>
          <input placeholder="score" ref={guessedScore} />
          <button type="submit">Submit score</button>
        </form>
      )}
    </div>
  );
};

export default GuesserControls;

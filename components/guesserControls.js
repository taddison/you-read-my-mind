import React, { useState } from "react";
import { ApiRoutes } from "../consts";
import { mutate } from "swr";
import Slider from "rc-slider";
import { ScoreRange } from "../consts"

const { Min, Max } = ScoreRange;

const GuesserControls = ({ roundState }) => {
  const [guessedScore, setGuessedScore] = useState(0);

  const submitGuess = async () => {
    await fetch("/api/setGuessedScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guessedScore: guessedScore,
      }),
    });
    mutate(ApiRoutes.GetGameState);
  };

  const confirmGuess = async () => {
    await fetch('/api/confirmGuessedScore', {
      method: "POST",
    });
    mutate(ApiRoutes.GetGameState)
  }

  return (
    <div>
      {roundState === "Guessing" && (
        <>
        <div>Set your guess ({Min} to {Max}):</div>
        <Slider min={Min} max={Max} value={guessedScore} onChange={setGuessedScore} />
        <div onClick={submitGuess}>Submit guess</div>
        {roundState.guessedScore !== null && <div onClick={confirmGuess}>Confirm guess</div>}
        </>
      )}
    </div>
  );
};

export default GuesserControls;

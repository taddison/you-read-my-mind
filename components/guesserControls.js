import React, { useState } from "react";
import Slider from "rc-slider";
import { ScoreRange } from "consts";

const { Min, Max } = ScoreRange;

const GuesserControls = ({ round, refreshGameState, gameId }) => {
  const [guessedScore, setGuessedScore] = useState(round.guessedScore ?? 0);

  const submitGuess = async () => {
    await fetch(`/api/game/${gameId}/setGuessedScore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guessedScore: guessedScore,
      }),
    });
    refreshGameState();
  };

  const confirmGuess = async () => {
    await fetch(`/api/game/${gameId}/confirmGuessedScore`, {
      method: "POST",
    });
    refreshGameState();
  };

  return (
    <div className="mt-3 max-w-xl mx-auto">
      {round.state === "Guessing" && (
        <>
          <div className="flex items-center">
            <div className="p-1 font-semibold">{Min}</div>
            <Slider
              min={Min}
              max={Max}
              value={guessedScore}
              onChange={setGuessedScore}
            />
            <div className="p-1 font-semibold">{Max}</div>
          </div>
          <div className="flex justify-center">
            <button className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300 mr-2" onClick={submitGuess}>
              Set Guess ({guessedScore})
            </button>
            {round.guessedScore !== null && (
              <button
                onClick={confirmGuess}
                disabled={round.guessedScore === null}
                className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300 mr-2"
              >
                Confirm Guess
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GuesserControls;

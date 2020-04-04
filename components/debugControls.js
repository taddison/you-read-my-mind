import React from "react";
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const gameStates = [
  "waiting-empty",
  "waiting-others",
  "waiting-others-asplayer",
  "secrets-me-psychic",
  "secrets-me-guesser",
  "secrets-me-other",
  "guessing-me-psychic",
  "guessing-me-guesser",
  "guessing-me-other",
  "finished-me-psychic",
  "finished-me-guesser",
  "finished-me-other"
];

const DebugControls = () => {
  const setGameState = async state => {
    await fetch("/api/debug/setGameState", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state })
    });
    mutate(ApiRoutes.GetGameState);
  };

  return (
    <div className="max-w-xs">
      Debugging controls. Set game state:
      <ul>
        {gameStates.map(gs => {
          return (
            <li key={gs} onClick={async () => setGameState(gs)} className="my-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded">
              {gs}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DebugControls;

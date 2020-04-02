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
    <div style={{marginTop: '50px'}}>
      Debugging controls. Set game state:
      <ul>
        {gameStates.map(gs => {
          return (
            <li key={gs} style={{marginTop: '10px'}}>
              <button onClick={async () => setGameState(gs)}>{gs}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DebugControls;

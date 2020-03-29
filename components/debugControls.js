import React from 'react'
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const gameStates = ["waiting-empty", "waiting-others", "secrets-me-psychic", "secrets-me-guesser", "guessing-me-psychic", "guessing-me-guesser"]

const DebugControls = () => {

  const setGameState = async (state) => {
    await fetch("/api/debug/setGameState", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state })
    });
    mutate(ApiRoutes.GetGameState);
  }

  return (
    <div>
      Debugging controls.  Set game state:
      <ul>
        {gameStates.map(gs => {
          return <li key={gs}><button onClick={async () => setGameState(gs)}>{gs}</button></li>
        })}
      </ul>
    </div>
  )
}

export default DebugControls;

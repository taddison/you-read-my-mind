import React, { useState } from "react";

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
  "finished-me-other",
];

const DebugControls = ({refreshGameState}) => {
  const [visible, setVisible] = useState(true);

  const setGameState = async (state) => {
    await fetch("/api/debug/setGameState", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state }),
    });
    refreshGameState();
  };

  return (
    <section className="bg-gray-200 p-2 mt-4 max-w-xs absolute bottom-0 right-0">
      <button onClick={() => setVisible((v) => !v)}>
        {visible ? "Hide Debug Tools" : "Show Debug Tools"}
      </button>
      {visible && (
        <ul>
          {gameStates.map((gs) => {
            return (
              <li
                key={gs}
                onClick={async () => setGameState(gs)}
                className="my-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
              >
                {gs}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default DebugControls;

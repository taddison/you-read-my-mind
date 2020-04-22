import React from "react";

import PsychicControls from "./psychicControls";
import GuesserControls from "./guesserControls";

const PlayerControls = ({ gameState, sessionId, refreshGameState }) => {
  if (!gameState) return <div>Loading...</div>;

  const isPsychic = gameState?.round?.psychic === sessionId;
  const isGuesser = gameState?.round?.guesser === sessionId;

  return (
    <div>
      {isPsychic && 
        <PsychicControls
          roundState={gameState?.round?.state}
          guesser={gameState?.round?.guesser}
          refreshGameState={refreshGameState}
        />
      }
      {isGuesser && <GuesserControls roundState={gameState?.round?.state} round={gameState?.round} refreshGameState={refreshGameState} />}
    </div>
  );
};

export default PlayerControls;

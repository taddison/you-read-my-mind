import React from "react";

import PsychicControls from "./psychicControls";
import GuesserControls from "./guesserControls";

const PlayerControls = ({ gameState, sessionId, gameId, refreshGameState }) => {
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
          gameId={gameId}
        />
      }
      {isGuesser && <GuesserControls round={gameState?.round} refreshGameState={refreshGameState} gameId={gameId} />}
    </div>
  );
};

export default PlayerControls;

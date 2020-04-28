import React from "react";
import JoinInput from "components/joinInput";

const PlayerList = ({
  playerList = [],
  sessionId = "",
  gameId,
  refreshGameState,
}) => {
  const takeRole = async (roleName) => {
    await fetch(`/api/game/${gameId}/takeRole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleName }),
    });
    refreshGameState();
  };

  const relinquishRole = async () => {
    await fetch(`/api/game/${gameId}/relinquishRole`, {
      method: "POST",
    });
    refreshGameState();
  };

  const takeGuesser = async () => {
    await takeRole("guesser");
  };

  const takePsychic = async () => {
    await takeRole("psychic");
  };

  const player = playerList.find((p) => p.sessionId === sessionId);
  const hasGuesser = !!playerList.find(p => p.isGuesser);
  const hasPsychic = !!playerList.find(p => p.isPsychic);
  const isPlayerInGame = !!player;
  const isPlayerPsychic = player?.isPsychic ?? false;
  const isPlayerGuesser = player?.isGuesser ?? false;
  const isPlayerInRole = isPlayerPsychic || isPlayerGuesser;
  const playerCanTakeARole = isPlayerInGame && !isPlayerInRole && !(hasGuesser && hasPsychic) ;

  return (
    <div className="flex flex-col max-w-xl">
        <div className="mb-2">
          <div className="py-1 px-2 rounded mb-2 font-semibold text-lg">
            Players
          </div>
          <ul className="pb-2 px-2">
            {playerList.length === 0 && <li>Nobody here yet!</li>}
            {playerList.map((player) => {
              return (
                <li key={player.sessionId}>
                  {player.name}{" "}
                  {player.isGuesser && (
                    <span className="font-semibold">the guesser ❓</span>
                  )}
                  {player.isPsychic && (
                    <span className="font-semibold">the psychic 🤔</span>
                  )}
                  {player.sessionId === sessionId && (
                    <span className="italic text-xs">(you)</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          {!isPlayerInGame && (
            <JoinInput gameId={gameId} refreshGameState={refreshGameState} />
          )}
          {playerCanTakeARole && (
            <>
              <button className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300" onClick={takePsychic}>Become the Psychic</button>
              <button className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300" onClick={takeGuesser}>Become the Guesser</button>
            </>
          )}
          {isPlayerInRole && (
            <button className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300" onClick={relinquishRole}>
              Stop being the {isPlayerGuesser ? "Guesser" : "Psychic"}
            </button>
          )}
          {isPlayerInGame && !isPlayerInRole && (
            <button className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300"
              onClick={async () => {
                await fetch(`/api/game/${gameId}/removePlayer`, {
                  method: "POST",
                });
                refreshGameState();
              }}
            >
              Leave Game
            </button>
          )}
        </div>
      </div>
  );
};

export default PlayerList;

import React from "react";

const PlayerList = ({ playerList = [] }) => {
  const otherPlayers = playerList.filter((p) => !p.isPsychic && !p.isGuesser);

  return (
    <div>
      <ul>
        <li className="bg-blue-100 max-w-lg pb-2 mb-4">
          <p className="bg-red-200 py-1 px-2 rounded mb-2 font-semibold">Psychic</p>
          <p className="px-2">
            {playerList.find((p) => p.isPsychic)?.name ?? "Waiting for a psychic..."}
          </p>
        </li>
        <li className="bg-blue-100 max-w-lg pb-2">
          <p className="bg-red-200 py-1 px-2 rounded mb-2 font-semibold">Guesser</p>
          <p className="px-2">
            {playerList.find((p) => p.isGuesser)?.name ?? "Waiting for a guesser"}
          </p>
        </li>
      </ul>
      {otherPlayers.length ? (
        <div className="mt-4">
          Players
          <ul>
            {playerList
              .filter((p) => !p.isPsychic && !p.isGuesser)
              .map((player) => {
                return <li key={player.sessionId}>{player.name}</li>;
              })}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PlayerList;

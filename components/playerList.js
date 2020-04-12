import React from "react";
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const PlayerList = ({ playerList = [] }) => {
  const otherPlayers = playerList.filter((p) => !p.isPsychic && !p.isGuesser);

  return (
    <div className="max-w-lg mx-2">
      <ul>
        <li className="bg-gray-200 pb-2 mb-4">
          <p className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
            Psychic
          </p>
          <p className="px-2">
            {playerList.find((p) => p.isPsychic)?.name ??
              "Waiting for a psychic"}
          </p>
        </li>
        <li className="bg-gray-200 pb-2">
          <p className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
            Guesser
          </p>
          <p className="px-2">
            {playerList.find((p) => p.isGuesser)?.name ??
              "Waiting for a guesser"}
          </p>
        </li>
      </ul>
      {otherPlayers.length ? (
        <div className="mt-4 bg-gray-200">
        <p className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
            Players
          </p>
          <ul className="bg-gray-200 pb-2 px-2">
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

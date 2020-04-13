import React from "react";
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const PlayerList = ({ playerList = [], sessionId = "" }) => {
  const takeRole = async (roleName) => {
    await fetch(ApiRoutes.TakeRole, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleName }),
    });
    mutate(ApiRoutes.GetGameState);
  };

  const relinquishRole = async () => {
    await fetch(ApiRoutes.RelinquishRole, {
      method: "POST",
    });
  };

  const takeGuesser = async () => {
    await takeRole("guesser");
  };

  const takePsychic = async () => {
    await takeRole("psychic");
  };

  const psychic = playerList.find((p) => p.isPsychic);
  const guesser = playerList.find((p) => p.isGuesser);
  const otherPlayers = playerList.filter((p) => !p.isPsychic && !p.isGuesser);

  return (
    <div className="max-w-lg mx-2">
      <ul>
        <li className="bg-gray-200 pb-2 mb-4">
          <p className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
            Psychic
          </p>
          <p className="px-2">
            {psychic ? (
              <div>
                {psychic.name}{" "}
                {psychic.sessionId === sessionId && (
                  <button onClick={relinquishRole}>Leave Role</button>
                )}
              </div>
            ) : (
              <div>
                Waiting for a Psychic{" "}
                <button onClick={takePsychic}>Become the Psychic</button>
              </div>
            )}
          </p>
        </li>
        <li className="bg-gray-200 pb-2">
          <p className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
            Guesser
          </p>
          <p className="px-2">
            {guesser ? (
              <div>
                {guesser.name}{" "}
                {guesser.sessionId === sessionId && (
                  <button onClick={relinquishRole}>Leave Role</button>
                )}
              </div>
            ) : (
              <div>
                Waiting for a Guesser{" "}
                <button onClick={takeGuesser}>Become the Guesser</button>
              </div>
            )}
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

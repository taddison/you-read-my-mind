import React from "react";

const PlayerList = ({ playerList = [], sessionId = "", refreshGameState }) => {
  const takeRole = async (roleName) => {
    await fetch('/api/takeRole', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleName }),
    });
    refreshGameState();
  };

  const relinquishRole = async () => {
    await fetch('/api/relinquishRole', {
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
    <div className="flex">
      <div>
        <ul>
          <li className="bg-gray-200 pb-2 mb-4">
            <div className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
              Psychic
            </div>
            <div className="px-2">
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
            </div>
          </li>
          <li className="bg-gray-200 pb-2">
            <div className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
              Guesser
            </div>
            <div className="px-2">
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
            </div>
          </li>
        </ul>
      </div>
      <div>
        {otherPlayers.length ? (
          <div className="bg-gray-200">
            <div className="bg-gray-400 py-1 px-2 rounded mb-2 font-semibold">
              Players
            </div>
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
    </div>
  );
};

export default PlayerList;

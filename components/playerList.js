import React from "react";

const PlayerList = ({ playerList = [] }) => {
  const otherPlayers = playerList.filter(p => !p.isPsychic && !p.isGuesser);

  return (
    <div>
      <ul>
        <li>Psychic: {playerList.find(p => p.isPsychic)?.name ?? "No psychic"}</li>
        <li>Guesser: {playerList.find(p => p.isGuesser)?.name ?? "No guesser"}</li>
      </ul>
      {otherPlayers.length ? (
        <div>
      Players
      <ul>
        {playerList.filter(p => !p.isPsychic && !p.isGuesser).map(player => {
          return <li key={player.sessionId}>{player.name}</li>;
        })}
      </ul>
        </div>
      ) : ''}
    </div>
  );
};

export default PlayerList;

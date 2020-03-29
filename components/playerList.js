import React from "react";

const PlayerList = ({ playerList }) => {
  return (
    <div>
      Players
      <ul>
        {playerList &&
          playerList.map(player => {
            return <li key={player.sessionId}>{player.name}</li>;
          })}
      </ul>
    </div>
  );
};

export default PlayerList;

import React, { useRef } from "react";
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const PlayerControls = ({ isPlayerInGame }) => {
  const playerName = useRef(null);

  return (
    <div>
      {!isPlayerInGame && (
        <button
          onClick={async () => {
            await fetch("/api/removePlayer", {
              method: "POST"
            });
            mutate(ApiRoutes.GetGameState);
          }}
        >
          Remove Me
        </button>
      )}
      {isPlayerInGame && (
        <form>
          <label>Enter your name</label>
          <input placeholder="Your Name" ref={playerName} />
          <button
            onClick={async e => {
              e.preventDefault();
              if(playerName.current.value === "") {
                alert('You must enter a name');
                return;
              }

              await fetch("/api/addPlayer", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: playerName.current.value })
              });
              mutate(ApiRoutes.GetGameState);
            }}
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
};

export default PlayerControls;

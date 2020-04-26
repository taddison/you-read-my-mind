import React, { useRef } from "react";

const JoinInput = ({ refreshGameState, gameId }) => {
  const playerName = useRef(null);

  return (
    <div>
      <form>
        <input
          className="py-2 px-4 rounded-lg border"
          placeholder="Your Name"
          ref={playerName}
        />
        <button
          className="ml-2 py-2 px-3 border rounded-lg hover:bg-gray-300"
          onClick={async (e) => {
            e.preventDefault();
            if (playerName.current.value === "") {
              alert("You must enter a name");
              return;
            }

            await fetch(`/api/game/${gameId}/addPlayer`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: playerName.current.value }),
            });
            refreshGameState();
          }}
        >
          Join Game
        </button>
      </form>
    </div>
  );
};

export default JoinInput;

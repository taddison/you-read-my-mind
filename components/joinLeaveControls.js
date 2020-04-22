import React, { useRef } from "react";

const JoinLeaveControls = ({ isPlayerInGame, refreshGameState }) => {
  const playerName = useRef(null);

  return (
    <div className="mt-5 mx-2">
      {isPlayerInGame && (
        <button
          className="rounded bg-gray-400 py-1 px-2"
          onClick={async () => {
            await fetch("/api/removePlayer", {
              method: "POST",
            });
            refreshGameState();
          }}
        >
          Remove Me
        </button>
      )}
      {!isPlayerInGame && (
        <form className="bg-gray-200 max-w-lg rounded py-4 px-8">
          <label className="block mb-1 text-sm text-gray-700">
            Enter your name
          </label>
          <input
            className="py-2 px-4 rounded border-solid border-gray-400 border-2"
            placeholder="Your Name"
            ref={playerName}
          />
          <button
            className="py-2 px-4 mx-3 rounded text-white tracking-wider bg-blue-300 hover:bg-blue-500"
            onClick={async (e) => {
              e.preventDefault();
              if (playerName.current.value === "") {
                alert("You must enter a name");
                return;
              }

              await fetch("/api/addPlayer", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: playerName.current.value }),
              });
              refreshGameState()
            }}
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
};

export default JoinLeaveControls;

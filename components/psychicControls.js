import React, { useRef } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates } from "../consts";

const PsychicControls = ({roundState, secretScore}) => {
  const psychicSubject = useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("/api/setPsychicSecrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ psychicSubject: psychicSubject.current.value })
    });
    mutate(ApiRoutes.GetGameState);
  };

  return (
    <div>
      {/* Choose a card */}
      {roundState === RoundStates.SettingSecrets && (
      <form onSubmit={handleSubmit}>
        <label>Enter your word</label>
        <input placeholder="word" ref={psychicSubject} />
        <button type="submit">All done</button>
      </form>
      )}
      {roundState === RoundStates.Guessing && (
        <div>
          Your Score: {secretScore} (Only you can see this!)
        </div>
      )}
    </div>
  );
};

export default PsychicControls;

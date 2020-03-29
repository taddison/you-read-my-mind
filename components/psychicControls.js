import React, { useRef } from "react";
import { mutate } from "swr";
import { ApiRoutes } from "../consts";

const PsychicControls = () => {
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
      <form onSubmit={handleSubmit}>
        <label>Enter your word</label>
        <input placeholder="word" ref={psychicSubject} />
        <button type="submit">All done</button>
      </form>
    </div>
  );
};

export default PsychicControls;

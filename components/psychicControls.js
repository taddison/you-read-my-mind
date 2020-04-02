import React, { useRef } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates } from "../consts";

const PsychicControls = ({ roundState, secretScore }) => {
  const psychicSubject = useRef(null);
  const psychicCardId = useRef(null);
  const psychicScore = useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("/api/setPsychicSecrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        psychicSubject: psychicSubject.current.value,
        leftStatement: cards.find(c => Number(psychicCardId.current.value) === c.id).from,
        rightStatement: cards.find(c => Number(psychicCardId.current.value) === c.id).to,
        psychicScore: psychicScore.current.value
      })
    });
    mutate(ApiRoutes.GetGameState);
  };

  const cards = [{
    id: 1,
    from: "Bad",
    to: "Good"
  }];

  return (
    <div>
      {roundState === RoundStates.SettingSecrets && (
        <form onSubmit={handleSubmit}>
          <label>Enter your word</label>
          <input placeholder="word" ref={psychicSubject} />

          <label>
            {cards[0].from}, {cards[0].to}
          </label>
          <input type="radio" value={cards[0].id} ref={psychicCardId} />

          <label>Score</label>
          <input placeholder="your score" ref={psychicScore} />

          <button type="submit">All done</button>
        </form>
      )}
      {roundState === RoundStates.Guessing && (
        <div>Your Score: {secretScore} (Only you can see this!)</div>
      )}
    </div>
  );
};

export default PsychicControls;

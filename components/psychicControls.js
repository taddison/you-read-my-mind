import React, { useRef, useState } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates } from "../consts";

const PsychicControls = ({ roundState, secretScore }) => {
  const psychicSubject = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
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
        leftStatement: selectedCard.from,
        rightStatement: selectedCard.to,
        psychicScore: psychicScore.current.value
      })
    });
    mutate(ApiRoutes.GetGameState);
  };

  const cards = [
    {
      id: 1,
      from: "Bad",
      to: "Good"
    },
    {
      id: 2,
      from: "Sane",
      to: "Insane"
    }
  ];

  return (
    <div>
      {roundState === RoundStates.SettingSecrets && (
        <form onSubmit={handleSubmit}>
          <label>Enter your word</label>
          <input placeholder="word" ref={psychicSubject} />

          {cards.map(card => {
            return (
              <div key={card.id}>
                <label htmlFor={`card-${card.id}`}>
                  {card.from} - {card.to}
                </label>
                <input
                  type="radio"
                  checked={selectedCard?.id === card.id}
                  onChange={() => setSelectedCard(card)}
                />
              </div>
            );
          })}
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

import React, { useRef, useState, useEffect } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates } from "../consts";

const PsychicControls = ({ roundState, secretScore, guesser }) => {
  const psychicSubject = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const psychicScore = useRef(null);
  const customFrom = useRef(null);
  const customTo = useRef(null);
  const [cards, setCards] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/setPsychicSecrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        psychicSubject: psychicSubject.current.value,
        leftStatement: selectedCard.from,
        rightStatement: selectedCard.to,
        psychicScore: psychicScore.current.value,
      }),
    });
    mutate(ApiRoutes.GetGameState);
  };

  useEffect(() => {
    setCards([
      {
        id: 1,
        from: "Bad",
        to: "Good",
      },
      {
        id: 2,
        from: "Sane",
        to: "Insane",
      },
    ]);
  }, []);

  return (
    <div>
      {roundState === RoundStates.SettingSecrets && (
        <form onSubmit={handleSubmit}>
          <label>Enter your word</label>
          <input placeholder="word" ref={psychicSubject} />

          {cards.map((card) => {
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
          <div>
            <label htmlFor="custom-card">
              From: <input placeholder="from" ref={customFrom} />
              To: <input placeholder="to" ref={customTo} />
            </label>
            <input
              type="radio"
              checked={selectedCard?.id === "custom"}
              onChange={() =>
                setSelectedCard({
                  id: "custom",
                  from: customFrom.current.value,
                  to: customTo.current.value,
                })
              }
            />
          </div>
          <label>Score</label>
          <input placeholder="your score" ref={psychicScore} />

          <button type="submit">All done</button>
        </form>
      )}
      {(roundState === RoundStates.WaitingForPlayers ||
        roundState === RoundStates.Finished) &&
      guesser ? (
        <button
          type="button"
          onClick={async (e) => {
            await fetch("/api/startGame", {
              method: "POST",
            });
            mutate(ApiRoutes.GetGameState);
          }}
        >
          Let's start
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default PsychicControls;

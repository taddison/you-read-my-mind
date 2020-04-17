import React, { useRef, useState, useEffect } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates, ScoreRange } from "../consts";

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
    <div className="max-w-6xl mx-auto mt-4">
      {roundState === RoundStates.SettingSecrets && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg mb-2">Select a Subject</h2>

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
          <h2 className="text-lg mt-6 mb-2">Decide on a word or phrase</h2>
          <input
            className="py-2 px-4 rounded border"
            placeholder="It could be anything"
            ref={psychicSubject}
          />

          <h2 className="text-lg mt-6 mb-2">Assign a Score</h2>
          <input
            className="py-2 px-4 rounded border"
            placeholder={`${ScoreRange.Min} to ${ScoreRange.Max}`}
            ref={psychicScore}
          />

          <button
            className="block mt-8 font-semibold py-2 px-4 tracking-wider border rounded hover:bg-gray-300"
            type="submit"
          >
            Start the Guessing
          </button>
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

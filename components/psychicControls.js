import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { ApiRoutes, RoundStates, ScoreRange } from "../consts";

const Card = ({ left, right, selected = false, onClick }) => {
  return (
    <div className="w-1/3 px-4" onClick={onClick}>
      <div
        className={`px-4 flex flex-row border rounded-lg font-semibold italic hover:border-gray-700 ${
          selected ? "border-gray-700" : ""
        }`}
      >
        <div className="flex-grow border-r py-12 text-center">{left}</div>
        <div className="flex-grow py-12 text-center">{right}</div>
      </div>
    </div>
  );
};

const PsychicControls = ({ roundState, guesser }) => {
  const [cards, setCards] = useState([]);

  const [showCustomCard, setShowCustomCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [psychicSubject, setPsychicSubject] = useState("");
  const [psychicScore, setPsychicScore] = useState("");
  const [leftStatement, setLeftStatement] = useState("");
  const [rightStatement, setRightStatement] = useState("");

  const setSecrets = async () => {
    // Validation

    await fetch("/api/setPsychicSecrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        psychicSubject,
        leftStatement,
        rightStatement,
        psychicScore,
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
      {
        id: 3,
        from: "Tired",
        to: "Wired",
      },
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-4">
      {roundState === RoundStates.SettingSecrets && (
        <div>
          <h2 className="text-lg mb-4">Select a Subject</h2>

          {!showCustomCard && (
            <div>
              <div className="flex">
                {cards.map((card) => {
                  return (
                    <Card
                      key={card.id}
                      left={card.from}
                      right={card.to}
                      selected={selectedCardId === card.id}
                      onClick={() => {
                        setSelectedCardId(card.id);
                        setLeftStatement(card.from);
                        setRightStatement(card.to);
                      }}
                    />
                  );
                })}
              </div>
              <button className="block py-1 px-3 border rounded-lg">
                Show more cards
              </button>
            </div>
          )}
          {showCustomCard && (
            <div>
              From:{" "}
              <input
                placeholder="From Something"
                value={leftStatement}
                onChange={(e) => setLeftStatement(e.target.value)}
              />
              To:{" "}
              <input
                placeholder="To Something"
                value={rightStatement}
                onChange={(e) => setRightStatement(e.target.value)}
              />
            </div>
          )}
          <button
            className="block py-1 px-3 border rounded-lg"
            onClick={() => {
              // If showing the custom card UX, clear the selection
              if (!showCustomCard) {
                setSelectedCardId(null);
                setLeftStatement("");
                setRightStatement("");
              }

              setShowCustomCard((s) => !s);
            }}
          >
            {showCustomCard ? "Pick an existing card" : "Write my own card"}
          </button>

          <h2 className="text-lg mt-6 mb-2">Decide on a word or phrase</h2>
          <input
            className="py-2 px-4 rounded border"
            placeholder="It could be anything"
            value={psychicSubject}
            onChange={(e) => setPsychicSubject(e.target.value)}
          />

          <h2 className="text-lg mt-6 mb-2">Assign a Score</h2>
          {(leftStatement.length > 0 && rightStatement.length > 0 && psychicSubject.length > 0) && (
            <div className="text-md italic">
              From {leftStatement} ({ScoreRange.Min}) to {rightStatement} (
              {ScoreRange.Max}) where would you place {psychicSubject}?
            </div>
          )}
          <input
            className="py-2 px-4 rounded border"
            value={psychicScore}
            placeholder={`${ScoreRange.Min} to ${ScoreRange.Max}`}
            onChange={(e) => setPsychicScore(e.target.value)}
          />

          <button
            className="block mt-8 font-semibold py-2 px-4 tracking-wider border rounded hover:bg-gray-300"
            onClick={setSecrets}
          >
            Start the Guessing
          </button>
        </div>
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

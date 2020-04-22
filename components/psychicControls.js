import React, { useState, useEffect } from "react";
import { RoundStates, ScoreRange } from "../consts";

// https://stackoverflow.com/a/6274381
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

const PsychicControls = ({ roundState, guesser, refreshGameState }) => {
  const [cards, setCards] = useState([]);
  const [cardSelection, setCardSelection] = useState([]);

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
    refreshGameState();
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

  const clearSelectedCard = () => {
    setSelectedCardId(null);
    setLeftStatement("");
    setRightStatement("");
  };

  const selectRandomCards = () => {
    setCardSelection(shuffle([...cards]).slice(0, 3));
  };

  useEffect(() => {
    selectRandomCards();
  }, [cards]);

  const isValid =
    psychicSubject.length > 0 &&
    leftStatement.length > 0 &&
    rightStatement.length > 0 &&
    psychicScore.length > 0;

  return (
    <div className="max-w-6xl mx-auto mt-4">
      {roundState === RoundStates.SettingSecrets && (
        <div>
          <h2 className="text-lg mb-4">Select a Subject</h2>

          {!showCustomCard && (
            <div className="mb-2">
              <div className="flex">
                {cardSelection.map((card) => {
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
              <button
                className="block py-1 px-3 border rounded-lg hover:bg-gray-300 my-2"
                onClick={() => {
                  clearSelectedCard();
                  selectRandomCards();
                }}
              >
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
            className="block py-1 px-3 border rounded-lg hover:bg-gray-300"
            onClick={() => {
              // If showing the custom card UX, clear the selection
              if (!showCustomCard) {
                clearSelectedCard();
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
          {leftStatement.length > 0 &&
            rightStatement.length > 0 &&
            psychicSubject.length > 0 && (
              <div className="text-md italic">
                From {leftStatement} ({ScoreRange.Min}) to {rightStatement} (
                {ScoreRange.Max}) where would you place {psychicSubject}?
              </div>
            )}
          <input
            className="py-2 px-4 rounded border w-32"
            value={psychicScore}
            placeholder={`${ScoreRange.Min} to ${ScoreRange.Max}`}
            type="number"
            min={ScoreRange.Min}
            step={1}
            max={ScoreRange.Max}
            onChange={(e) => setPsychicScore(e.target.value)}
          />

          <button
            className={`block mt-8 font-semibold py-2 px-4 tracking-wider border rounded hover:bg-gray-300 ${
              !isValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={setSecrets}
            disabled={!isValid}
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
            refreshGameState();
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

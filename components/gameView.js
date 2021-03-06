import React from "react";
import { RoundStates, ScoreRange } from "consts";
import Gauge from "components/gauge";

const GameView = ({ gameState }) => {
  if (!gameState) return <div>Loading...</div>;
  if (!gameState.players) return <div>Invalid game id</div>;

  const players = gameState.players;
  const psychic = players.find((player) => player.isPsychic) ?? "";
  const guesser = players.find((player) => player.isGuesser) ?? "";
  const round = gameState.round;
  const state = round.state;

  const currentStatusText = () => {
    if (!round.psychic || !round.guesser) {
      return "Waiting for a psychic and a guesser";
    }

    switch (state) {
      case RoundStates.WaitingForPlayers:
        return `Waiting for ${psychic.name} to start the round`;
      case RoundStates.SettingSecrets:
        return `${psychic.name} is selecting their card, their subject, and their rating`;
      case RoundStates.Guessing:
        return `${guesser.name} is setting the groups guess`;
      case RoundStates.Finished:
        return "It's all over! How close was your guess?";
      default:
        return "I don't know how we got here.  SOS.";
    }
  };

  return (
    <div>
      <div className="text-xl py-2 px-3">▶ {currentStatusText()}</div>
      {(state === RoundStates.Guessing || state === RoundStates.Finished) && (
        <div className="flex items-center flex flex-col max-w-4xl mx-auto">
          <div className="text-xl font-semibold">{round.psychicSubject}</div>
          <div className="flex mt-6">
            <div className="flex items-center italic mr-6">
              {round.leftStatement}
            </div>
            <div className="flex flex-col items-center">
              <Gauge
                min={ScoreRange.Min}
                max={ScoreRange.Max}
                markerValue={round.guessedScore}
                arrowValue={round.psychicScore}
              />
              <div className="flex mt-6">
                <div className="flex flex-col items-center mr-6">
                  <div className="text-5xl font-black">
                    {round.psychicScore ?? "??"}
                  </div>
                  <div className="font-semibold">Psychic</div>
                </div>
                <div className="flex flex-col items-center ml-6">
                  <div className="text-5xl font-black">
                    {round.guessedScore ?? "??"}
                  </div>
                  <div className="font-semibold">Guessed</div>
                </div>
              </div>
            </div>
            <div className="flex items-center italic ml-6">
              {round.rightStatement}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;

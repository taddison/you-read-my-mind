import React from "react";
import { RoundStates } from "../consts";

const GameView = ({ gameState }) => {
  const players = gameState?.players ?? [];
  const psychic = players.find(player => player.isPsychic) ?? '';
  const guesser = players.find(player => player.isGuesser) ?? '';

  const currentStatusText = () => {
    const round = gameState?.round;
    const state = round?.state;

    if(!state) {
      return "Uh oh, bug in currentStatusText!"
    }

    switch (state) {
      case RoundStates.WaitingForPlayers:
        if (!round.psychic || !round.guesser) {
          return "Waiting for a psychic and a guesser";
        } else {
          // Must have both - psychic needs to start the round
          return `Waiting for ${psychic.name} to start the round`;
        }
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

  if (!gameState) return <div>Initializing...</div>;

  return (
    <div>
      <div>{currentStatusText()}</div>
    </div>
  );
};

export default GameView;

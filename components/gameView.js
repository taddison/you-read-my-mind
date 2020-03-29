import React from "react";
import { RoundStates } from "../consts";

const GameView = ({ gameState }) => {
  const players = gameState.players;
  const psychic = players.find(player => player.isPsychic) ?? '';
  const guesser = players.find(player => player.isGuesser) ?? '';
  const round = gameState.round;
  const state = round.state;

  const currentStatusText = () => {

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

  return (
    <div>
      <div>{currentStatusText()}</div>
      {(state === RoundStates.Guessing || state === RoundStates.Finished) && (
        <ul>
          <li>From: {gameState.round.leftStatement}</li>
          <li>To: {gameState.round.rightStatement}</li>
          <li>Subject: {gameState.round.psychicSubject}</li>
        </ul>
      )}
      {state === RoundStates.Finished && (
        <ul>
          <li>{`${guesser.name}'s Score: ${round.guessedScore}`}</li>
          <li>{`${psychic.name}'s Score: ${round.psychicScore}`}</li>
        </ul>
      )}
    </div>
  );
};

export default GameView;

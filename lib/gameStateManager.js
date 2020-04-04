import {
  addPlayer as addPlayerDb,
  getPlayers,
  removePlayer as removePlayerDb,
  getRound,
  setRound,
} from "./db";
import { RoundStates } from "../consts";

export const addPlayer = async (sessionId, name) => {
  // Player already in the game? Do nothing
  const players = getPlayers();
  if (players.find((p) => p.sessionId === sessionId)) {
    return;
  }

  // Add the player to the game
  await addPlayerDb(sessionId, name);

  // Any roles need filling?
  const round = await getRound();

  if (!round.psychic) {
    await setRound({
      ...round,
      psychic: sessionId,
    });
    return;
  }

  if (!gameState.round.guesser) {
    await setRound({
      ...round,
      guesser: sessionId,
    });
    return;
  }
};

export const removePlayer = async (sessionId) => {
  // TODO: Handle if you remove the player in a key role (psychic, guesser)
  await removePlayerDb(sessionId);
};

export const getGameState = async (sessionId) => {
  const players = getPlayers();
  const round = await getRound();

  players.map((player) => {
    if (round.psychic === player.sessionId) {
      player.isPsychic = true;
    }
    if (round.guesser === player.sessionId) {
      player.isGuesser = true;
    }
  });

  // TODO: Hide secret parts of the game state depending on the session/round state
  const gameState = {
    players,
    round: round,
  };
  return gameState;
};

export const setPsychicSecrets = async (
  sessionId,
  psychicSubject,
  leftStatement,
  rightStatement,
  psychicScore
) => {
  const round = await getRound();

  if (sessionId !== round.psychic) {
    throw new Error("Only the psychic can set psychic secrets");
  }

  if (round.state !== RoundStates.SettingSecrets) {
    throw new Error(
      `Round is not in the correct state to set secrets - currently ${round.state}`
    );
  }

  await setRound({
    ...round,
    psychicSubject,
    leftStatement,
    rightStatement,
    psychicScore,
    state: RoundStates.Guessing,
  });
};

export const setGuessedScore = async (sessionId, guessedScore) => {
  const round = await getRound();

  if (sessionId !== round.guesser) {
    throw new Error("Only the guesser can set the guess.");
  }

  if (round.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  await setRound({
    ...round,
    guessedScore,
  });
};

export const confirmGuessedScore = async (sessionId) => {
  const round = await getRound();

  if (sessionId !== round.guesser) {
    throw new Error("Only the guesser can confirm the guess.");
  }

  if (round.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  if (!round.guessedScore) {
    throw new Error("No score set yet, set a score first.");
  }

  await setRound({
    ...round,
    state: RoundStates.Finished,
  });
};

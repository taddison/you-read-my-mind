import {
  addPlayer as addPlayerDb,
  getPlayers,
  removePlayer as removePlayerDb
} from "./db";
import {
  getGame,
  setGame
} from "./faunaDb";
import { RoundStates } from "../consts";

const gameId = "261909046864380436";

export const addPlayer = async (sessionId, name) => {
  // Player already in the game? Do nothing
  const players = getPlayers();
  if (players.find((p) => p.sessionId === sessionId)) {
    return;
  }

  // Add the player to the game
  await addPlayerDb(sessionId, name);

  // Any roles need filling?
  const game = await getGame(gameId);

  if (!game.psychic) {
    await setGame(gameId, {
      ...game,
      psychic: sessionId,
    });
    return;
  }

  if (!game.guesser) {
    await setGame(gameId, {
      ...game,
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
  const game = await getGame(gameId);

  players.map((player) => {
    if (game.psychic === player.sessionId) {
      player.isPsychic = true;
    }
    if (game.guesser === player.sessionId) {
      player.isGuesser = true;
    }
  });

  // TODO: Hide secret parts of the game state depending on the session/round state
  const gameState = {
    players,
    round: game,
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
  const game = await getGame(gameId);

  if (sessionId !== game.psychic) {
    throw new Error("Only the psychic can set psychic secrets");
  }

  if (game.state !== RoundStates.SettingSecrets) {
    throw new Error(
      `Round is not in the correct state to set secrets - currently ${round.state}`
    );
  }

  await setGame(gameId, {
    ...game,
    psychicSubject,
    leftStatement,
    rightStatement,
    psychicScore,
    state: RoundStates.Guessing,
  });
};

export const setGuessedScore = async (sessionId, guessedScore) => {
  const game = await getGame(gameId);

  if (sessionId !== game.guesser) {
    throw new Error("Only the guesser can set the guess.");
  }

  if (game.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  await setGame(gameId,{
    ...game,
    guessedScore,
  });
};

export const confirmGuessedScore = async (sessionId) => {
  const game = await getGame(gameId);

  if (sessionId !== game.guesser) {
    throw new Error("Only the guesser can confirm the guess.");
  }

  if (game.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  if (!game.guessedScore) {
    throw new Error("No score set yet, set a score first.");
  }

  await setGame(gameId,{
    ...game,
    state: RoundStates.Finished,
  });
};

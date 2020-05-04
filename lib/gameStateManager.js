import {
  getGame,
  setGame,
  createSession,
  deleteSession,
} from "./store/APP_TARGET";
import { RoundStates, ScoreRange } from "../consts";
import shuffle from "lib/shuffle";

export const addPlayer = async (sessionId, gameId, name) => {
  // Player already in the game? Do nothing
  const game = await getGame(gameId);
  if (game.sessions.find((s) => s.sessionId === sessionId)) {
    return;
  }

  await createSession(sessionId, gameId, name);
};

export const removePlayer = async (sessionId, gameId) => {
  const game = await getGame(gameId);
  if (game.psychic === sessionId || game.guesser === sessionId) {
    throw new Error("Cannot remove a player when they are in a role");
  }

  await deleteSession(sessionId, gameId);
};

export const takeRole = async (sessionId, gameId, roleName) => {
  if (roleName !== "guesser" && roleName !== "psychic") {
    throw new Error(
      `roleName must be guesser or psychic, supplied: ${roleName}`
    );
  }

  const game = await getGame(gameId);

  if (game.psychic === sessionId || game.guesser === sessionId) {
    throw new Error("Player already has a role in this game");
  }

  if (game.sessions.filter((s) => s.sessionId === sessionId).length === 0) {
    throw new Error("Only players in the game can take a role");
  }

  if (roleName === "guesser") {
    if (game.guesser) {
      throw new Error("Game already has a guesser");
    }

    await setGame(gameId, {
      ...game,
      guesser: sessionId,
    });
    return;
  }

  if (roleName === "psychic") {
    if (game.psychic) {
      throw new Error("Game already has a psychic");
    }

    await setGame(gameId, {
      ...game,
      psychic: sessionId,
    });
    return;
  }
};

export const relinquishRole = async (sessionId, gameId) => {
  const game = await getGame(gameId);
  if (game.psychic !== sessionId && game.guesser !== sessionId) {
    throw new Error("This session does not have either role");
  }

  await setGame(gameId, {
    ...game,
    guesser: sessionId === game.guesser ? null : game.guesser,
    psychic: sessionId === game.psychic ? null : game.psychic,
  });
};

export const getGameState = async (sessionId, gameId) => {
  const game = await getGame(gameId);

  game.sessions.map((player) => {
    if (game.psychic === player.sessionId) {
      player.isPsychic = true;
    }
    if (game.guesser === player.sessionId) {
      player.isGuesser = true;
    }
  });

  const playerIsPsychic = game.psychic === sessionId;
  // Hide information that should be hidden based on round state
  if (game.state === RoundStates.Guessing && !playerIsPsychic) {
    game.psychicScore = null;
  }

  const gameState = {
    players: game.sessions,
    round: game,
  };

  return gameState;
};

const throwIfScoreInvalid = (score) => {
  if (!Number.isInteger(score)) {
    throw new Error("Score did not parse to an integer");
  }

  if (score < ScoreRange.Min || score > ScoreRange.Max) {
    throw new Error(
      `Score must be between ${ScoreRange.Min} and ${ScoreRange.Max}. Provided: ${score}.`
    );
  }
};

export const setPsychicSecrets = async (
  sessionId,
  gameId,
  psychicSubject,
  leftStatement,
  rightStatement,
  psychicScore
) => {
  psychicScore = parseInt(psychicScore);
  throwIfScoreInvalid(psychicScore);

  const game = await getGame(gameId);

  if (sessionId !== game.psychic) {
    throw new Error("Only the psychic can set psychic secrets");
  }

  if (game.state !== RoundStates.SettingSecrets) {
    throw new Error(
      `Round is not in the correct state to set secrets - currently ${game.state}`
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

export const setGuessedScore = async (sessionId, gameId, guessedScore) => {
  guessedScore = parseInt(guessedScore);
  throwIfScoreInvalid(guessedScore);

  const game = await getGame(gameId);

  if (sessionId !== game.guesser) {
    throw new Error("Only the guesser can set the guess.");
  }

  if (game.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  await setGame(gameId, {
    ...game,
    guessedScore,
  });
};

export const confirmGuessedScore = async (sessionId, gameId) => {
  const game = await getGame(gameId);

  if (sessionId !== game.guesser) {
    throw new Error("Only the guesser can confirm the guess.");
  }

  if (game.state !== RoundStates.Guessing) {
    throw new Error("It is not the time to guess.");
  }

  if (game.guessedScore === null) {
    throw new Error("No score set yet, set a score first.");
  }

  await setGame(gameId, {
    ...game,
    state: RoundStates.Finished,
  });
};

export const startGame = async (sessionId, gameId, flipRoles) => {
  const game = await getGame(gameId);

  if (sessionId !== game.psychic) {
    throw new Error("You are not the psychic.");
  }

  if (!game.guesser) {
    throw new Error("Game is not ready, guesser missing.");
  }

  if (!game.psychic) {
    throw new Error("Game is not ready, psychic missing.");
  }

  if (
    game.state !== RoundStates.Finished &&
    game.state !== RoundStates.WaitingForPlayers
  ) {
    throw new Error("Game cannot be restarted in this state.");
  }

  flipRoles = !!flipRoles;
  if (flipRoles) {
    if (game.sessions.length === 2) {
      [game.psychic, game.guesser] = [game.guesser, game.psychic];
    } else {
      const otherPlayers = game.sessions.filter(
        (s) => s.sessionId !== game.psychic && s.sessionId !== game.guesser
      );
      game.psychic = game.guesser;
      game.guesser = shuffle(otherPlayers)[0].sessionId;
    }
  }

  await setGame(gameId, {
    ...game,
    state: RoundStates.SettingSecrets,
    leftStatement: null,
    rightStatement: null,
    psychicSubject: null,
    psychicScore: null,
    guessedScore: null,
  });
};

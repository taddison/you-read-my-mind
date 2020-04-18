import {
  getGame,
  setGame,
  getSessions,
  createSession,
  deleteSession,
} from "./localDb";
import { RoundStates } from "../consts";

const gameId = "261909046864380436";

export const addPlayer = async (sessionId, name) => {
  // Player already in the game? Do nothing
  const sessions = await getSessions();
  if (sessions.find((s) => s.sessionId === sessionId)) {
    return;
  }

  await createSession(sessionId, name);
};

export const takeRole = async (sessionId, roleName) => {
  if (roleName !== "guesser" && roleName !== "psychic") {
    throw new Error(
      `roleName must be guesser or psychic, supplied: ${roleName}`
    );
  }

  const game = await getGame(gameId);

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

export const relinquishRole = async (sessionId) => {
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

export const removePlayer = async (sessionId) => {
  // TODO: Handle if you remove the player in a key role (psychic, guesser)

  const sessions = await getSessions();
  const sessionsToRemove = sessions.filter((s) => s.sessionId === sessionId);
  for (let session of sessionsToRemove) {
    await deleteSession(session._id);
  }
};

export const getGameState = async (sessionId) => {
  const game = await getGame(gameId);
  const sessions = await getSessions();

  sessions.map((player) => {
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
    players: sessions,
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

  // TODO: Bounds check for score
  psychicScore = parseInt(psychicScore);

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

  // TODO: Bounds check for score
  guessedScore = parseInt(guessedScore);

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

export const confirmGuessedScore = async (sessionId) => {
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

export const startGame = async (sessionId) => {
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

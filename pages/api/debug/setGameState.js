import {
  setGame,
  getSessions,
  createSession,
  deleteSession,
} from "lib/store/APP_TARGET";
import { RoundStates } from "consts";
import addSession from "lib/addSession";

const setGameState = async (players, gameId, round) => {
  await setGame(gameId, round);

  const sessions = await getSessions(gameId);
  for (let session of sessions) {
    await deleteSession(session.sessionId, gameId);
  }

  for (let player of players) {
    await createSession(player.sessionId, gameId, player.name);
  }
};

const blankRound = () => {
  return {
    psychic: null,
    guesser: null,
    leftStatement: null,
    rightStatement: null,
    state: RoundStates.WaitingForPlayers,
    psychicSubject: null,
    psychicScore: null,
    guessedScore: null,
  };
};

const defaultRound = () => {
  return { ...blankRound(), psychic: "psychic", guesser: "guesser" };
};

const animalCrossingSecretsRound = () => {
  return {
    ...defaultRound(),
    state: RoundStates.Guessing,
    leftStatement: "Bad",
    rightStatement: "Good",
    psychicSubject: "Animal Crossing",
    psychicScore: 10,
  };
};

const emptyPlayers = () => [];

const defaultPlayers = () => {
  return [
    { sessionId: "guesser", name: "GuesserPlayer" },
    { sessionId: "psychic", name: "PsychicPlayer" },
  ];
};

export default (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).end();
    return;
  }

  addSession(req);
  const { sessionId } = req;
  console.log(sessionId)
  const { state, gameId } = req.body;
  const name = "TESTER";

  const playersTesterAsPsychic = [
    { sessionId: "guesser", name: "GuesserPlayer" },
    { sessionId, name },
  ];
  const playersTesterAsGuesser = [
    { sessionId: "psychic", name: "PsychicPlayer" },
    { sessionId, name },
  ];

  const defaultPlayersWithTesterExtra = [
    ...defaultPlayers(),
    { sessionId, name },
  ];

  switch (req.body.state) {
    case "waiting-empty":
      setGameState(emptyPlayers(), gameId, blankRound());
      break;
    case "waiting-others":
      setGameState(defaultPlayers(), gameId, defaultRound());
      break;
    case "waiting-others-asplayer":
      setGameState(
        [...defaultPlayers(), { sessionId, name }],
        gameId,
        defaultRound()
      );
      break;
    case "secrets-me-psychic":
      setGameState(playersTesterAsPsychic, gameId, {
        ...defaultRound(),
        psychic: sessionId,
        state: RoundStates.SettingSecrets,
      });
      break;
    case "secrets-me-guesser":
      setGameState(playersTesterAsGuesser, gameId, {
        ...defaultRound(),
        guesser: sessionId,
        state: RoundStates.SettingSecrets,
      });
      break;
    case "secrets-me-other":
      setGameState(defaultPlayersWithTesterExtra, gameId, {
        ...defaultRound(),
        state: RoundStates.SettingSecrets,
      });
      break;
    case "guessing-me-psychic":
      setGameState(playersTesterAsPsychic, gameId, {
        ...animalCrossingSecretsRound(),
        psychic: sessionId,
      });
      break;
    case "guessing-me-guesser":
      setGameState(playersTesterAsGuesser, gameId, {
        ...animalCrossingSecretsRound(),
        guesser: sessionId,
      });
      break;
    case "guessing-me-other":
      setGameState(defaultPlayersWithTesterExtra, gameId, {
        ...animalCrossingSecretsRound(),
      });
      break;
    case "finished-me-psychic":
      setGameState(playersTesterAsPsychic, gameId, {
        ...animalCrossingSecretsRound(),
        guessedScore: 5,
        state: RoundStates.Finished,
        psychic: sessionId,
      });
      break;
    case "finished-me-guesser":
      setGameState(playersTesterAsGuesser, gameId, {
        ...animalCrossingSecretsRound(),
        guessedScore: 5,
        state: RoundStates.Finished,
        guesser: sessionId,
      });
      break;
    case "finished-me-other":
      setGameState(defaultPlayersWithTesterExtra, gameId, {
        ...animalCrossingSecretsRound(),
        guessedScore: 5,
        state: RoundStates.Finished,
      });
      break;
    default:
      console.log(`unknown state called in setGameState: ${state}`);
      break;
  }

  res.status(201).end();
};

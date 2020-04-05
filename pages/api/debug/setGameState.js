import {
  setGame,
  getSessions,
  createSession,
  deleteSession,
} from "../../../lib/faunaDb";
import { RoundStates } from "../../../consts";
import addSession from "../../../lib/addSession";

const gameId = "261909046864380436";

const setGameState = async (players, round) => {
  await setGame(gameId, round);

  const sessions = await getSessions();
  for (let session of sessions) {
    await deleteSession(session._id);
  }

  for (let player of players) {
    await createSession(player.sessionId, player.name);
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
  addSession(req);
  const { sessionId } = req;
  const { state } = req.body;
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
      setGameState(emptyPlayers(), blankRound());
      break;
    case "waiting-others":
      setGameState(defaultPlayers(), defaultRound());
      break;
    case "waiting-others-asplayer":
      setGameState([...defaultPlayers(), { sessionId, name }], defaultRound());
      break;
    case "secrets-me-psychic":
      setGameState(playersTesterAsPsychic, {
        ...defaultRound(),
        psychic: sessionId,
        state: RoundStates.SettingSecrets,
      });
      break;
    case "secrets-me-guesser":
      setGameState(playersTesterAsGuesser, {
        ...defaultRound(),
        guesser: sessionId,
        state: RoundStates.SettingSecrets,
      });
      break;
    case "secrets-me-other":
      setGameState(defaultPlayersWithTesterExtra, {
        ...defaultRound(),
        state: RoundStates.SettingSecrets,
      });
      break;
    case "guessing-me-psychic":
      setGameState(playersTesterAsPsychic, {
        ...animalCrossingSecretsRound(),
        psychic: sessionId,
      });
      break;
    case "guessing-me-guesser":
      setGameState(playersTesterAsGuesser, {
        ...animalCrossingSecretsRound(),
        guesser: sessionId,
      });
      break;
    case "guessing-me-other":
      setGameState(defaultPlayersWithTesterExtra, {
        ...animalCrossingSecretsRound(),
      });
      break;
    case "finished-me-psychic":
      setGameState(playersTesterAsPsychic, {
        ...animalCrossingSecretsRound(),
        guessedScore: 5,
        state: RoundStates.Finished,
        psychic: sessionId,
      });
      break;
    case "finished-me-guesser":
      setGameState(playersTesterAsGuesser, {
        ...animalCrossingSecretsRound(),
        guessedScore: 5,
        state: RoundStates.Finished,
        guesser: sessionId,
      });
      break;
    case "finished-me-other":
      setGameState(defaultPlayersWithTesterExtra, {
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

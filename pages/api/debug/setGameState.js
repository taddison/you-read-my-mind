import { setGameState } from "../../../lib/db";
import { RoundStates } from "../../../consts";
import addSession from "../../../lib/addSession";

const blankRound = () => {
  return {
    psychic: null,
    guesser: null,
    leftStatement: null,
    rightStatement: null,
    state: RoundStates.WaitingForPlayers,
    psychicSubject: null,
    psychicScore: null,
    guessedScore: null
  };
};

export default (req, res) => {
  addSession(req);
  const { sessionId } = req;
  const { state } = req.body;
  const name = "TESTER";

  switch (req.body.state) {
    case "waiting-empty":
      setGameState([], blankRound());
      break;
    case "waiting-others":
      setGameState(
        [
          { sessionId: "1", name: "Psychic" },
          { sessionId: "2", name: "Guesser" },
          { sessionId, name}
        ],
        { ...blankRound(), psychic: "1", guesser: "2" }
      );
      break;
    case "secrets-me-psychic":
      setGameState(
        [
          { sessionId, name },
          { sessionId: "2", name: "Guesser" }
        ],
        {
          ...blankRound(),
          psychic: sessionId,
          guesser: "2",
          state: RoundStates.SettingSecrets
        }
      );
      break;
      case "secrets-me-guesser":
        setGameState(
          [
            { sessionId, name },
            { sessionId: "1", name: "Psychic" }
          ],
          {
            ...blankRound(),
            psychic: "1",
            guesser: sessionId,
            state: RoundStates.SettingSecrets
          }
        );
        break;
        case "guessing-me-psychic":
        setGameState(
          [
            { sessionId, name },
            { sessionId: "2", name: "Guesser" }
          ],
          {
            ...blankRound(),
            psychic: sessionId,
            guesser: "2",
            state: RoundStates.Guessing,
            leftStatement: "Bad",
            rightStatement: "Good",
            psychicSubject: "Animal Crossing",
            psychicScore: 10
          }
        );
        break;
        case "guessing-me-guesser":
        setGameState(
          [
            { sessionId, name },
            { sessionId: "1", name: "Psychic" }
          ],
          {
            ...blankRound(),
            psychic: "1",
            guesser: sessionId,
            state: RoundStates.Guessing,
            leftStatement: "Bad",
            rightStatement: "Good",
            psychicSubject: "Animal Crossing",
            psychicScore: 10
          }
        );
        break;
    default:
      console.log(`unknown state called in setGameState: ${state}`);
      break;
  }

  res.status(201).end();
};

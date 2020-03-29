import { RoundStates } from "../consts";

let players = [];

let round = {
  psychic: null,
  guesser: null,
  leftStatement: null,
  rightStatement: null,
  state: RoundStates.WaitingForPlayers,
  psychicSubject: null,
  psychicScore: null,
  guessedScore: null
};

/* Debug method only */
export const setGameState = async (newPlayers, newRound) => {
  players = newPlayers;
  round = newRound;
};
/* End Debug */

export const getRound = async () => {
  return round;
};

export const getPlayers = () => {
  return players;
};

export const addPlayer = async (sessionId, name) => {
  players.push({ sessionId, name });
};

export const removePlayer = async sessionId => {
  players = players.filter(player => player.sessionId !== sessionId);
};

export const setPsychic = async sessionId => {
  round.psychic = sessionId;
};

export const setGuesser = async sessionId => {
  round.guesser = sessionId;
};

export const setPsychicSecrets = async (
  psychicSubject,
  leftStatement,
  rightStatement,
  psychicScore
) => {
  (round.psychicSubject = psychicSubject),
    (round.leftStatement = leftStatement),
    (round.rightStatement = rightStatement),
    (round.psychicScore = psychicScore);
};

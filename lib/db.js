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
  guessedScore: null,
};

/* Debug method only */
export const setGameState = async (newPlayers, newRound) => {
  players = newPlayers;
};
/* End Debug */

export const getPlayers = () => {
  return players;
};

export const addPlayer = async (sessionId, name) => {
  players.push({ sessionId, name });
};

export const removePlayer = async (sessionId) => {
  players = players.filter((player) => player.sessionId !== sessionId);
};

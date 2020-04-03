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
  setRound(newRound);
};
/* End Debug */

export const setRound = ({psychic, guesser, leftStatement, rightStatement, state, psychicSubject, psychicScore, guessedScore}) => {
  round.psychic = psychic;
  round.guesser = guesser;
  round.leftStatement = leftStatement;
  round.rightStatement = rightStatement;
  round.state = state;
  round.psychicSubject = psychicSubject;
  round.psychicScore = psychicScore;
  round.guessedScore = guessedScore;
}

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
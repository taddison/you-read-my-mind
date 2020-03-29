import { RoundStates } from '../consts';

let players = [
  { sessionId: "psychic01", name: "Fake Psychic" },
  { sessionId: "guess01", name: "Fake Guesser" }
];

let round = {
  psychic: "psychic01",
  guesser: "guess01",
  leftStatement: null,
  rightStatement: null,
  state: RoundStates.WaitingForPlayers,
  psychicPhrase: null,
  psychicScore: null,
  guessedScore: null
};

export const getRound = async () => {
  return round;
}

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
}

export const setGuesser = async sessionId => {
  round.guesser = sessionId;
}
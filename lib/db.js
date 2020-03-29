import { RoundStates } from '../consts';

let players = [
  { sessionId: "123", name: "Fake Guy" },
  { sessionId: "456", name: "Fake Girl" }
];

let round = {
  psychic: "456",
  guesser: null,
  leftStatement: null,
  rightStatement: null,
  state: RoundStates.WaitingForPlayers,
  psychicPhrase: null,
  psychicScore: null,
  guessedScore: null
};

export const getRoundState = async () => {
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

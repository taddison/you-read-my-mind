import { RoundStates } from '../consts';

let players = [
  { sessionId: "123", name: "Fake Guy" },
  { sessionId: "456", name: "Fake Girl" }
];

let round = {
  psychic: null,
  guesser: null,
  state: RoundStates.WaitingForPlayers,
  secretWord: null,
  secretScore: null,
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

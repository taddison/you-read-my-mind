let players = [
  { sessionId: "123", name: "Fake Guy" },
  { sessionId: "456", name: "Fake Girl" }
];

export const getPlayers = () => {
  return players;
};

export const addPlayer = (sessionId, name) => {
  players.push({ sessionId, name });
};

export const removePlayer = sessionId => {
  players = players.filter(player => player.sessionId !== sessionId);
};

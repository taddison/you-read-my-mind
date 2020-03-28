let players = [
  { sessionId: "123", name: "Fake Guy" },
  { sessionId: "456", name: "Fake Girl" },
  { sessionId: "a964edcdf005c4766f611af638f94f1e", name: "A real person" }
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

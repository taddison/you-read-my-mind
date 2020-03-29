let players = [
  { sessionId: "123", name: "Fake Guy" },
  { sessionId: "456", name: "Fake Girl" },
];

export const getPlayers = () => {
  return players;
};

export const addPlayer = (sessionId, name) => {
  if(players.find(p => p.sessionId === sessionId)) {
    return;
  }

  players.push({ sessionId, name });
};

export const removePlayer = sessionId => {
  players = players.filter(player => player.sessionId !== sessionId);
};

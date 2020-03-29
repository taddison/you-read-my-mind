import {
  addPlayer as addPlayerDb,
  getPlayers,
  removePlayer as removePlayerDb,
  getRound,
  setPsychic,
  setGuesser
} from "./db";

export const addPlayer = async (sessionId, name) => {
  // Player already in the game? Do nothing
  const players = getPlayers();
  if (players.find(p => p.sessionId === sessionId)) {
    return;
  }

  // Add the player to the game
  await addPlayerDb(sessionId, name);

  // Any roles need filling?
  const gameState = await getGameState();

  if(!gameState.round.psychic) {
    await setPsychic(sessionId);
    return;
  }

  if(!gameState.round.guesser) {
    await setGuesser(sessionId);
    return;
  }
};

export const removePlayer = async sessionId => {
  // TODO: Handle if you remove the player in a key role (psychic, guesser)
  await removePlayerDb(sessionId);
};

export const getGameState = async sessionId => {
  const players = getPlayers();
  const round = await getRound();

  players.map(player => {
    if(round.psychic === player.sessionId) {
      player.isPsychic = true;
    }
    if(round.guesser === player.sessionId) {
      player.isGuesser = true;
    }
  });

  // TODO: Hide secret parts of the game state depending on the session/round state
  const gameState = {
    players,
    round: round
  };
  return gameState;
};

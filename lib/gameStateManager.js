import { addPlayer as addPlayerDb , getPlayers, removePlayer as removePlayerDb, getRoundState } from "./db";

export const addPlayer = async (sessionId, name) => {
  if (getPlayers().find(p => p.sessionId === sessionId)) {
    return;
  }

  await addPlayerDb(sessionId, name);
}

export const removePlayer = async sessionId => {
  // TODO: Handle if you remove the player in a key role (psychic, guesser)
  await removePlayerDb(sessionId);
}

export const getGameState = async sessionId => {
  const players = getPlayers();
  const roundState = await getRoundState();
  // TODO: Hide secret parts of the game state depending on the session/round state
  const gameState = {
    players,
    roundState,
  };
  return gameState;
}
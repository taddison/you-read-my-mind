import { getPlayers } from "../../db/db";

export default (req, res) => {
  const players = getPlayers();
  const gameState = {
    players
  };

  res.status(200).json(gameState);
};

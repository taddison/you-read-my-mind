import { getGameState } from "../../lib/gameStateManager";
import addSession from "../../lib/addSession";

export default async (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;
  const gameState = await getGameState(sessionId);

  res.status(200).json(gameState);
};

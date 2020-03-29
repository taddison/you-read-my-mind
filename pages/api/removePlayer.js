import { removePlayer } from "../../lib/gameStateManager";
import addSession from "../../lib/addSession";

export default async (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;

  await removePlayer(sessionId);
  res.status(204).end();
};

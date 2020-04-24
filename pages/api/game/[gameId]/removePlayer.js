import { removePlayer } from "lib/gameStateManager";
import addSession from "lib/addSession";

export default async (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;
  const { gameId } = req.query;

  await removePlayer(sessionId), gameId;
  res.status(204).end();
};

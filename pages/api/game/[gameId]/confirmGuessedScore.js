import { confirmGuessedScore } from "lib/gameStateManager";
import addSession from "lib/addSession";

export default async (req, res) => {
  addSession(req);
  const { sessionId } = req;
  const { gameId } = req.query;

  try {
    await confirmGuessedScore(sessionId, gameId);
    res.status(200).end();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

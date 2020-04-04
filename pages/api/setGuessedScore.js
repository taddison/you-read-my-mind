import addSession from "../../lib/addSession";
import { setGuessedScore } from "../../lib/gameStateManager";

export default async (req, res) => {
  addSession(req);

  const { guessedScore } = req.body;
  const { sessionId } = req;

  try {
    await setGuessedScore(sessionId, guessedScore);
    res.status(201).end();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

import addSession from '../../../../lib/addSession'
import { startGame } from '../../../../lib/gameStateManager'

export default async (req, res) => {
  addSession(req)
  const { sessionId } = req
  const { gameId } = req.query;

  try {
    await startGame(sessionId, gameId);
    res.status(200).end();
  } catch(err) {
    res.status(401).json({ message: err.message });
  }
}
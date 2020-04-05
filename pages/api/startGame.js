import addSession from '../../lib/addSession'
import { startGame } from '../../lib/gameStateManager'

export default async (req, res) => {
  addSession(req)
  const { sessionId } = req

  try {
    await startGame(sessionId);
    res.status(200).end();
  } catch(err) {
    res.status(401).json({ message: err.message });
  }
}
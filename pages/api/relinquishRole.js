import { relinquishRole } from "../../lib/gameStateManager";
import addSession from "../../lib/addSession";

export default async (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;

  try {
    await relinquishRole(sessionId);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

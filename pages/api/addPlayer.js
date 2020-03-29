import { addPlayer } from "../../lib/gameStateManager";
import addSession from "../../lib/addSession";

export default async (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;
  const name = req.body.name;

  await addPlayer(sessionId, name);
  res.status(201).end();
};

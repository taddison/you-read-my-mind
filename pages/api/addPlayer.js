import { addPlayer, getPlayers } from "../../db/db";
import addSession from "../../lib/addSession";

export default (req, res) => {
  addSession(req);
  const sessionId = req.sessionId;

  if (getPlayers().find(p => p.sessionId === sessionId)) {
    res.status(200).end();
    return;
  }

  const name = req.body.name;
  addPlayer(sessionId, name);
  res.status(201).end();
};

import { removePlayer } from "../../db/db";
import addSession from "../../lib/addSession";

export default (req, res) => {
  addSession(req);

  removePlayer(req.sessionId);  
  res.status(204).end();
}
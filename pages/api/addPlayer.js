import { addPlayer } from "../../db/db";
import addSession from "../../lib/addSession";

export default (req, res) => {
  addSession(req);

  const name = req.body.name;
  addPlayer(req.sessionId, name);  
  res.status(201).end();
}
import { addPlayer } from "../../db/db";
import { SESSION_COOKIE_NAME } from "../../consts"

export default (req, res) => {
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  const name = req.body.name;
  addPlayer(sessionId, name);  
  res.status(201).end();
}
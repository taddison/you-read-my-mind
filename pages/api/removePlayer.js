import { removePlayer } from "../../db/db";
import { SESSION_COOKIE_NAME } from "../../consts"

export default (req, res) => {
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  removePlayer(sessionId);  
  res.status(204).end();
}
import { removePlayer } from "../../db/db";

export default (req, res) => {
  // TODO: Only the 'super user' should remove other players...
  
  removePlayer(req.body.sessionId);  
  res.status(204).end();
}
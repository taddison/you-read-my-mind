import { setPsychicSecrets } from "lib/gameStateManager";
import addSession from "lib/addSession";

export default async (req, res) => {
  addSession(req);

  const {
    psychicSubject,
    leftStatement,
    rightStatement,
    psychicScore,
  } = req.body;
  const { sessionId } = req;
  const { gameId } = req.query;

  try {
    await setPsychicSecrets(
      sessionId,
      gameId,
      psychicSubject,
      leftStatement,
      rightStatement,
      psychicScore
    );
    res.status(201).end();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

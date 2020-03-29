import { setPsychicSecrets } from "../../lib/gameStateManager"

export default async (req, res) => {
  await setPsychicSecrets(req.body.psychicSubject)
  res.status(201).end()
}
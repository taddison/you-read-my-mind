import { getCards } from "lib/cardManager";

export default async (req, res) => {
  try {
    const cards = await getCards();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

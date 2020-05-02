import {
  getCards as storeGetCards
} from "./store/APP_TARGET";

export const getCards = async () => {
  return await storeGetCards();
}
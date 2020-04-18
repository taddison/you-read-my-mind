import fetch from "isomorphic-unfetch";
const apiRoot = "http://localhost:8881";
const overrideGameId = "89";

export const getGame = async (id) => {
  const gameId = overrideGameId; //id
  const result = await fetch(`${apiRoot}/getgame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId }),
  });
  const json = await result.json();
  return json;
};

export const setGame = async (
  id,
  {
    psychic,
    guesser,
    leftStatement,
    rightStatement,
    state,
    psychicSubject,
    psychicScore,
    guessedScore,
  }
) => {
  const gameId = overrideGameId; // id
  await fetch(`${apiRoot}/setgame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gameId,
      psychic,
      guesser,
      leftStatement,
      rightStatement,
      state,
      psychicSubject,
      psychicScore,
      guessedScore,
    }),
  });
};

export const getSessions = async () => {
  const result = await fetch(`${apiRoot}/getsessions`);
  const json = await result.json();
  return json;
};

export const createSession = async (sessionId, name) => {
  await fetch(`${apiRoot}/createsession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, name }),
  });
};

export const deleteSession = async (id) => {
  await fetch(`${apiRoot}/deletesession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: id }),
  });
};

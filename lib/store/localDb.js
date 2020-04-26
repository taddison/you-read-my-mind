import fetch from "isomorphic-unfetch";
const apiRoot = "http://localhost:8881";

export const getGame = async (gameId) => {
  const result = await fetch(`${apiRoot}/getgame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId }),
  });
  const json = await result.json();
  return json;
};

export const setGame = async (
  gameId,
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

export const createSession = async (sessionId, gameId, name) => {
  await fetch(`${apiRoot}/createsession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, gameId, name }),
  });
};

export const deleteSession = async (sessionId, gameId) => {
  await fetch(`${apiRoot}/deletesession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, gameId }),
  });
};

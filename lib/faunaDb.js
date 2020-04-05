import fetch from "isomorphic-unfetch";

const apiKey = process.env.FAUNA_KEY;
const apiEndpoint = process.env.FAUNA_GRAPHQL_ENDPOINT;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-type": "application/json",
    Accept: "application/json",
  };
};

export const getGame = async (id) => {
  const query = `
  query FindGameByID($id: ID!) {
    game: findGameByID(id:$id) {
      psychic,
      guesser,
      leftStatement,
      rightStatement,
      state,
      psychicSubject,
      psychicScore,
      guessedScore
    }
  }`;

  const result = await fetch(apiEndpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: {
        id,
      },
    }),
  });

  const json = await result.json();
  return json?.data.game;
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
  const query = `mutation UpdateGame($id: ID!, $psychic: String, $guesser: String, $leftStatement: String, $rightStatement: String, $state: String!, $psychicSubject: String, $psychicScore: Int, $guessedScore: Int) {
    updateGame(id: $id, data: {
      psychic: $psychic,
      guesser: $guesser,
      leftStatement: $leftStatement,
      rightStatement: $rightStatement,
      psychicSubject: $psychicSubject,
      state: $state,
      psychicScore: $psychicScore,
      guessedScore: $guessedScore
    }) {
      _id
      guessedScore
      psychicScore
    }
  }`;

  console.log(guessedScore)

  const result = await fetch(apiEndpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: {
        id,
        psychic,
        guesser,
        leftStatement,
        rightStatement,
        state,
        psychicSubject,
        psychicScore,
        guessedScore,
      },
    }),
  });
  console.log(await result.json());
};

export const getSessions = async () => {
  const query = `
    query GetSessions {
      sessions {
        sessions: data {
          name,
          sessionId,
          _id
        }
      }
    }
  `;

  const result = await fetch(apiEndpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      query,
    }),
  });

  const json = await result.json();
  return json?.data.sessions.sessions;
};

export const createSession = async (sessionId, name) => {
  const query = `
  mutation CreateSession($sessionId: String!, $name: String!) {
    createSession(data: {
      sessionId: $sessionId,
      name: $name
    }) 
    {
      _id
    }
  }`;

  await fetch(apiEndpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: {
        sessionId,
        name,
      },
    }),
  });
};

export const deleteSession = async (id) => {
  const query = `
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      _id
    }
  }`;

  await fetch(apiEndpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: {
        id,
      },
    }),
  });
};

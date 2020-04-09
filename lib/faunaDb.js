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
  // TODO: Create a graphql query wrapper which
  // - Returns errors on failures like 4xx, 5xx
  // - Returns errors when there are errors return by the api
  // - Returns an error if the target path cannot be negotiated

  const queryName = "FindGameByID";

  const query = `
  query ${queryName}($id: ID!) {
    gamex: findGameByID(id:$id) {
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

  if(!result.ok) {
    console.error(`Error calling endpoint for query ${queryName}, status ${result.status}`);
    throw new Error(`HTTP error calling faunaDB endpoint for query ${queryName}`);
  }

  const json = await result.json();

  if(json.errors) {
    console.error(`FaunaDB returned an error for query ${queryName}`);
    console.log(json.errors);
    throw new Error(`GraphQL error returned from faunaDB for query ${queryName}`);
  }

  const returnPath = (obj) => obj?.data?.game;
  
  if(returnPath(json) === undefined) {
    console.error(`Shape of return object incorrect for ${queryName}`)
    console.log(json.data);
    throw new Error(`Shape of return object incorrect for ${queryName}`)
  }

  return returnPath(json);
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
    }
  }`;

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

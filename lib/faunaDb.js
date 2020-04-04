import fetch from "isomorphic-unfetch";

const apiKey = process.env.FAUNA_KEY;
const apiEndpoint = process.env.FAUNT_GRAPHQL_ENDPOINT;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-type": "application/json",
    Accept: "application/json",
  };
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

  await fetch(apiEndpoint, {
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

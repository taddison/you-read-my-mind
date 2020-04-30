# You Read My Mind

An implementation of [Wavelength].

Supports multiple backends:

- LocalDb - `yarn dev:localdb`
- FaunaDb - `yarn dev`

## Todos

- Surface errors from calling the API
  - GraphQL mutations which don't check the return type won't throw any errors, and look like they're silently failing
- Mutate's second argument might speed up the client UX
  - Several of the mutate APIs could trivially return the updated `game` state, and would obviate the need for the set/get pair of requests
- Add an admin page to clear our test data in prod
- Card library
  - Add to the backend
  - Add an API
- Record historic games (when the guess is confirmed)

### Transactions

A couple of operations should probably be transactional:

- Take role (first wins, not last wins)
  - Cannot take multiple roles
- Join game
  - If amending the player list should support multiple people joining at the same time (read list then append)
- Leave game
  - As above - list should mutate transactionally

It is also a simpler API to have a single game object (rather than game + sessions), so we have a single API call.  This probably means the store APIs need refactoring to remove the requirement for transactions to exist in the game state manager (so rather than calling `getGame` and `setGame` there would be a granular `addPlayerToGame` method).

Not essential as the worst case is someone has to refresh/type their name again (wait their turn to be the psychic/guesser).

### Updates

Currently no polling, so anyone in the game would need to refresh for updates.  Could be solved with polling, or using something like Pusher.

## Configuring LocalDb

Clone and run https://github.com/taddison/you-read-my-mind-local

## Configuring FaunaDb

- Create a new database
- Upload the graphql schema
- Create a new role, assign the role CRUD access to all collections, read access to all indexes
- Create a new API key
- Set the `FAUNA_KEY` environment variable to the key (you can use a `.env.local` file for this)
  - You also need to set the `FAUNA_GRAPHQL_ENDPOINT` environment variable

> For production you'll need to store this in Now Secrets - https://zeit.co/docs/v2/serverless-functions/env-and-secrets#adding-secrets

## References

- https://github.com/zeit/next.js/tree/master/examples/with-tailwindcss

From the zeit template:

> Purgecss takes a very straightforward approach to removing unused CSS. It simply searches an entire file for a string that matches a regular expression. As a result, class strings that are dynamically created in a template using string concatenation will be considered unused and removed from your stylesheet. Tailwind CSS addresses this problem in more detail in their documentation (https://tailwindcss.com/docs/controlling-file-size/#writing-purgeable-html).

## GraphQL Queries

```graphql
mutation createGame {
  createGame(data:{
    state:"WaitingForPlayers"
  }) {
    _id
  }
}
```

```graphql
query findGame{
  game: findGameByID(id: "idhere") {
    psychic,
      guesser,
      leftStatement,
      rightStatement,
      state,
      psychicSubject,
      psychicScore,
      guessedScore,
    sessions {
      data {
        _id,
        name,
        sessionId
      }
    }
  }
}
```


[wavelength]: https://www.wavelength.zone/

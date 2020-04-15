# You Read My Mind

An implementation of [Wavelength].

## Todos

- Surface errors from calling the API
  - GraphQL mutations which don't check the return type won't throw any errors, and look like they're silently failing
- Mutate's second argument might speed up the client UX
  - Several of the mutate APIs could trivially return the updated `game` state, and would obviate the need for the set/get pair of requests
  - Seems to particularly impact the player list rather than round state
- Add an admin page to clear our test data in prod
  - And/Or - GameID per environment

## Configuring Fauna

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

[wavelength]: https://www.wavelength.zone/

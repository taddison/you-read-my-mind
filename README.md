# You Read My Mind

An implementation of [Wavelength].

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

[Wavelength]: https://www.wavelength.zone/
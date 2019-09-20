const express = require("express");
const cors = require("cors");
const { buildSchema } = require("graphql");
const graphqlHttp = require("express-graphql");
const data = require("../data.json");

const app = express();

app.use(cors());
app.options("*", cors());

const schema = buildSchema(`
type Pokemon {
  id: ID!,
  name: String!,
  species_id: Int!,
  height: Int!,
  weight: Int!,
  base_experience: Int!,
  order: Int!,
}

type Query {
  allPokemon: [Pokemon!],
  pokemon(name: String!): Pokemon
}

input PokeInput {
  name: String!,
  species_id: Int!,
  height: Int!,
  weight: Int!,
  base_experience: Int!,
  order: Int!,
}

type Mutation {
  createPokemon(input: PokeInput!): Pokemon!
}
`);

let id = 0;

const rootValue = {
  allPokemon: () => data,
  pokemon: variables => data.find(pokemon => pokemon.name === variables.name),
  createPokemon: variables => {
    const newPoke = {
      ...variables.input,
      id: String(id++),
    };
    data.push(newPoke);
    return newPoke;
  },
};

const defaultQuery = `{
  pokemon(name:"pikachu") {
    id
    name
    weight
  }
}`;

app.use(
  "/",
  graphqlHttp({
    schema,
    rootValue,
    graphiql: {
      defaultQuery,
    },
  })
);

app.listen(3333, () => console.log("Listening on http://localhost:3333"));

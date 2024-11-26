const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const pool = require('../config/db');

// Step 1: Define your GraphQL schema using the gql template literal
const typeDefs = gql`
  type Query {
    hello: String
    country(code: String!): Country
  }

  type Mutation {
    addCountry(name: String!, code: String!, capital: String!, currency: String!): Country!
  }

  type Country {
    code: String
    name: String
    capital: String
    currency: String
  }

  type Query {
    countries: [Country]
  }

  type Query {
    auth: String
  }
`;

// Step 2: Define the resolvers to handle queries

async function executeQuery(query, values) 
{
   const client = await pool.connect();
   try {
     const result = await client.query(query, values);
     return result.rows;
   } catch (err) {
     console.error(err);
   } finally {
     client.release();
   }
}

//define function which accepts code as parameter
async function getCountry(capital, code, currency, name)
{
  console.log("Executing query...;")

  const query = `
    INSERT INTO Countries(code, name, capital, currency) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [code, name, capital, currency];

  const rows = await executeQuery(query, values);
  console.log(rows);

  return rows;

}

// Create a session store
const memoryStore = new session.MemoryStore();

// Initialize Keycloak with the configuration
const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": "ondc-seller",
  "auth-server-url": "http://ondc-keycloak:8080/",
  "ssl-required": "external",
  "resource": "ondc-client",
  "public-client": true,
  "confidential-port": 0
});

async function showKeycloak() {
  try {
    const authenticated = await keycloak.protect();
    return authenticated;
  } catch (error) {
    console.error("Failed to authenticate with Keycloak", error);
    throw new Error("Authentication failed");
  }
}
  
// Define resolvers
const resolvers = {
  Query: {
    //hello: () => 'Hello, world!',
    hello: () => getCountry(""),
    countries: () => { /* logic */ },
    auth: async () => await showKeycloak()
  },
  Mutation: {
    addCountry: async (_, { name, code, capital, currency }, { dataSources }) => {
      // Logic to insert country into the database
      //return await dataSources.countryAPI.addCountry({ name, code, capital, currency });
      return await getCountry(capital, code, currency, name);
    }
  }
};

// Step 3: Create an Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Step 4: Create an Express application
const app = express();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Step 5: Apply the Apollo GraphQL middleware to the Express app
server.start().then(() => {
    server.applyMiddleware({ app });
  
    // Start the server
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  });

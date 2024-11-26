import React, { useEffect, useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import AddCountry from './AddCountry';
import Keycloak from 'keycloak-js';
import { useQuery, gql } from '@apollo/client';


// Setup Apollo Client
const client = new ApolloClient({
  uri: 'http://ondc-backend:4000/graphql', // Pointing to the backend GraphQL API
  cache: new InMemoryCache(),
});

// Define the query that checks authentication from the backend
const AUTH_QUERY = gql`
  query {
    auth
  }
`;

// adding comment to trigger github action- v3

export default function App() {

  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const keycloak = new Keycloak({
      url: "https://ondcseller.in.net",
      clientId: "ondc-client",     
      realm: "ondc-seller",           
    }); 

    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
      .then(authenticated => {
        setKeycloak(keycloak);
        setAuthenticated(authenticated);
      })
      .catch(error => {
        console.error("Failed to initialize Keycloak", error);
      });
  }, []);

  if (!keycloak) {
    return <div>Loading Keycloak...</div>;
  }

  if (!authenticated) {
    return <div>Unable to authenticate</div>;
  }

  return (
    <div>
      <h1>Welcome {keycloak.tokenParsed.preferred_username}</h1>
      <button onClick={() => keycloak.logout()}>Logout</button>
      <ApolloProvider client={client}>
        <AddCountry />
      </ApolloProvider>
    </div>
  );
};

import Keycloak from 'keycloak-js';

export const initKeycloak = () => {
  const keycloak = new Keycloak({
    url: "http://localhost:8080",  
    clientId: "ondc-client",     
    realm: "ondc-seller",           
  });

  // Return a promise that resolves to an object with both the keycloak instance and authentication status
  return keycloak.init({ onLoad: 'login-required' })
    .then(authenticated => {
      return { keycloak, authenticated };
    })
    .catch(error => {
      console.error("Failed to initialize Keycloak", error);
      return { keycloak: null, authenticated: false };
    });
};

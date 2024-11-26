#!/bin/bash

# Wait for Keycloak to start
echo "Waiting for Keycloak to start..."
until curl -s "http://ondc-keycloak:8080/auth" > /dev/null; do
  sleep 1 # wait for 1 second before checking again
done

# Create realm
curl -X POST "http://ondc-keycloak:8080/auth/admin/realms" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" \
-d "username=admin&password=admin&grant_type=password" \
"http://ondc-keycloak:8080/auth/realms/master/protocol/openid-connect/token" | jq -r .access_token)" \
-d '{
  "realm": "ondc-seller",
  "enabled": true
}'

# Create client
curl -X POST "http://ondc-keycloak:8080/auth/admin/realms/ondc-seller/clients" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" \
-d "username=admin&password=admin&grant_type=password" \
"http://ondc-keycloak:8080/auth/realms/master/protocol/openid-connect/token" | jq -r .access_token)" \
-d '{
  "clientId": "ondc-client",
  "enabled": true,
  "publicClient": false,
  "protocol": "openid-connect",
  "redirectUris": ["http://localhost:3000/*"]
}'

# Create user
curl -X POST "http://ondc-keycloak:8080/auth/admin/realms/ondc-seller/users" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" \
-d "username=admin&password=admin&grant_type=password" \
"http://ondc-keycloak:8080/auth/realms/master/protocol/openid-connect/token" | jq -r .access_token)" \
-d '{
  "username": "newuser",
  "enabled": true,
  "email": "newuser@example.com",
  "firstName": "New",
  "lastName": "User",
  "credentials": [{
    "type": "password",
    "value": "newpassword",
    "temporary": false
  }]
}'

echo "Keycloak setup completed."

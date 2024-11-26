import { gql, useQuery } from '@apollo/client';

// GraphQL Query
const GET_COUNTRY = gql`
  query GetCountry($code: String!) {
    country(code: $code) {
      name
      capital
      currency
    }
  }
`;

// Main Component
const MainComponent = () => {
  const { loading, error, data } = useQuery(GET_COUNTRY, {
    variables: { code: "US" }, // Example query for the US country
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.country.name}</h1>
      <p>Capital: {data.country.capital}</p>
      <p>Currency: {data.country.currency}</p>
    </div>
  );
};
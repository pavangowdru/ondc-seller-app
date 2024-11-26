import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';

export const ADD_COUNTRY = gql`
    mutation AddCountry($capital: String!, $code: String!,  $currency: String!, $name: String! ) {
        addCountry(capital: $capital, code: $code, currency: $currency, name: $name) {
          capital
          code
          currency
          name
        }
    }
`

const AddCountry = () => {
  const [country, setCountry] = useState({ capital: '', code: '', currency:'', name: '' });
  const [addCountry, {data, loading, error}] = useMutation(ADD_COUNTRY);

  const handleChange = (e) => {
    const { name, value} = e.target;
    setCountry({ ...country, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Country Data:', country);
    try {
        await addCountry({ variables: { name: country.name, code: country.code, capital: country.capital, currency:country.currency} });
        alert('Country added successfully.');
        setCountry({ capital: '', code:'',  currency:'', name: ''});
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding country');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Country Code:
          <input type="text" name="code" value={country.code} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Country Name:
          <input type="text" name="name" value={country.name} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Country capital:
          <input type="text" name="capital" value={country.capital} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Country currency:
          <input type="text" name="currency" value={country.currency} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit" disabled={loading}>Add Country</button>
      {error && <p> Error: {error.message}</p>}
    </form>
  );
};

export default AddCountry;
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [artist, setArtist] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [inputType, setInputType] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const url = 'https://accounts.spotify.com/api/token';
    const client_id = '30f8bc7ee32a4537bdcd5666a008570e';
    const client_secret = 'ff69ca965c5d4bf88c8097c51a9635ca';

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      });

      if (response.ok) {
        const resToken = await response.json();
        console.log(resToken.access_token);
        setToken(resToken.access_token);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUser = async () => {
    const myToken = token;
    const url = 'https://api.spotify.com/v1/me';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });
      if (response.ok) {
        const resUser = await response.json();
        console.log(resUser.display_name);
        setUser(resUser);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getArtist = async () => {
    const myToken = token;
    const url =
      'https://api.spotify.com/v1/artists/75mafsNqNE1WSEVxIKuY5C?si=zsRpflKWTzGXpV-E-iH22w';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });
      if (response.ok) {
        const resArtist = await response.json();
        console.log(resArtist);
        setArtist(resArtist);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const newSearch = async () => {
    const query = inputSearch;
    const type = inputType;
    const myToken = token;
    const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=NZ&offset=0`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });
      if (response.ok) {
        const resSearch = await response.json();
        console.log(resSearch);
        setSearchResults(resSearch);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
      <input
        type='search'
        name='search'
        id='search'
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <p>{inputSearch}</p>
      <select
        name='type'
        id='type'
        onChange={(e) => setInputType(e.target.value)}
      >
        <option value='album'>album</option>
        <option value='artist'>artist</option>
        <option value='playlist'>playlist</option>
        <option value='track'>track</option>
      </select>
      <p>{inputType}</p>
      {artist && (
        <div>
          {artist.images && artist.images.length > 0 && (
            <img style={{ width: '20rem' }} src={artist.images[0].url} alt='' />
          )}
          {artist.name && <p>{artist.name}</p>}
        </div>
      )}
      <button onClick={newSearch}>search</button>
      <button onClick={getArtist}>get artist</button>
    </>
  );
}

export default App;

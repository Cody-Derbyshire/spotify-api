import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const CLIENT_ID = '30f8bc7ee32a4537bdcd5666a008570e';
const REDIRECT_URI = 'http://localhost:5173';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPE =
  'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-library-read user-library-modify ugc-image-upload app-remote-control playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private ';

const App = () => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [playback, setPlayback] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    const getToken = () => {
      let urlParams = new URLSearchParams(
        window.location.hash.replace('#', '?')
      );
      let token = urlParams.get('access_token');
    };

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);

    const getMe = async () => {
      const { data } = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await data;
      console.log(userData);
      setUser(userData);
    };
    getMe();

    const getPlayback = async () => {
      const { data } = await axios.get('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const playbackData = await data;
      console.log(playbackData);
      setPlayback(playbackData);
      console.log(playback.device.id);
    };
    getPlayback();
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const getMe = async () => {
    const { data } = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await data;
    console.log(userData);
    setUser(userData);
  };
  const getPlayback = async () => {
    const { data } = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const playbackData = await data;
    console.log(playbackData);

    setPlayback(playbackData);
  };

  const pausePlayback = async () => {
    const { data } = await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/pause?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const pauseData = await data;
    console.log(pauseData);
  };

  const nextTrack = async () => {
    const { data } = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/next?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const nextData = await data;
    console.log(nextData);
    getPlayback();
  };
  const prevTrack = async () => {
    const { data } = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/previous?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const prevData = await data;
    console.log(prevData);
    getPlayback();
  };

  return (
    <div>
      {!token ? (
        <div className='flex-column'>
          <h1>reactify</h1>
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            <button>login to spotify</button>
          </a>
        </div>
      ) : (
        <div className='flex-row'>
          <h1>reactify</h1>
          <button className='' onClick={logout}>
            logout
          </button>
        </div>
      )}
      {token && user ? (
        <div className='flex-row'>
          {user.images && user.images.length > 0 ? (
            <img src={user.images?.[0].url} alt='' />
          ) : null}
          <p>{user.display_name}</p>
        </div>
      ) : null}
      {/* {token ? (
        <div>
          <button onClick={getMe}>load user</button>
          {user ? <button onClick={getPlayback}>load player</button> : null}
        </div>
      ) : null} */}

      {token && playback ? (
        <p>
          playing <strong>{playback.item.name}</strong> by
          <strong> {playback.item.artists[0].name}</strong>
        </p>
      ) : null}
      {token && playback ? <button onClick={prevTrack}>&larr;</button> : null}
      {token && playback ? (
        <button onClick={pausePlayback}>pause</button>
      ) : null}
      {token && playback ? <button onClick={nextTrack}>&rarr;</button> : null}
    </div>
  );
};

export default App;

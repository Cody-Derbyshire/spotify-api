import { useState, useEffect } from 'react';
import React from 'react';
import Play from './assets/play.png';
import Pause from './assets/pause.png';
import Next from './assets/forward.png';
import Back from './assets/back.png';
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
  const [playback, setPlayback] = useState('');
  const [progress_ms, setProgress_ms] = useState('');
  const [song_name, setSong_name] = useState('');
  const [artist_name, setArtist_name] = useState('');
  const [album_name, setAlbum_name] = useState('');
  const [album_art, setAlbum_art] = useState('');
  const [uri, setUri] = useState('');
  const [duration_ms, setDuration_ms] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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

    const fetchData = async () => {
      try {
        const [userData, playbackData] = await Promise.all([
          axios.get('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUser(userData.data);
        setPlayback(playbackData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, playback]);

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

    setUser(userData);
  };

  const getPlayback = async () => {
    const { data } = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const playbackData = await data;

    setPlayback(playbackData);
  };

  const logData = () => {
    console.log(playback);
    console.log(user);
  };

  const pausePlayback = async () => {
    const { data } = await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/pause?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const pauseData = await data;
    /* console.log(pauseData); */
    console.log(playback.progress_ms);
    console.log(playback.item?.duration_ms);
    console.log(playback.item?.name);
    console.log(playback.item?.artists?.[0]?.name);
    console.log(playback.item?.album?.name);
    console.log(playback.item?.album?.images?.[0]?.url);
    console.log(playback.item?.uri);
    console.log(playback.is_playing);

    setProgress_ms(playback.progress_ms);
    setDuration_ms(playback.item?.duration_ms);
    setSong_name(playback.item?.name);
    setArtist_name(playback.item?.artists?.[0]?.name);
    setAlbum_name(playback.item?.album?.name);
    setAlbum_art(playback.item?.album?.images?.[0]?.url);
    setUri(playback.item?.uri);
    setIsPlaying(playback.is_playing);
  };

  const playPlayback = async () => {
    const { data } = await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/play?device_id=${playback.device.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        position_ms: `${progress_ms}`,
      },
    });
    setIsPlaying(playback.is_playing);
  };

  const nextTrack = async () => {
    const { data } = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/next?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const nextData = await data;
    /* console.log(nextData); */
    getPlayback();
    getPlayback();
  };
  const prevTrack = async () => {
    const { data } = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/previous?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const prevData = await data;
    /* console.log(prevData); */
    getPlayback();
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

      {token && playback ? (
        <p>
          playing <strong>{playback.item.name}</strong> by
          <strong> {playback.item.artists[0].name}</strong>
        </p>
      ) : null}
      <div className='flex-row'>
        {token && playback ? (
          <button onClick={prevTrack}>
            <img className='icon' src={Back} alt='' />
          </button>
        ) : null}
        {token && playback ? (
          <div>
            {playback.is_playing ? (
              <button onClick={pausePlayback}>
                <img className='icon' src={Pause} alt='' />
              </button>
            ) : (
              <button onClick={playPlayback}>
                <img className='icon' src={Play} alt='' />
              </button>
            )}
          </div>
        ) : null}
        {token && playback ? (
          <button onClick={nextTrack}>
            <img className='icon' src={Next} alt='' />
          </button>
        ) : null}
        {user && playback ? <button onClick={logData}>?</button> : null}
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import axios from 'axios';
import { motion } from 'framer-motion';

const CLIENT_ID = '30f8bc7ee32a4537bdcd5666a008570e';
const REDIRECT_URI = 'http://localhost:5173';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPE =
  'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-library-read user-library-modify ugc-image-upload app-remote-control playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private ';

const icon = {
  pause: (
    <img
      width='16'
      height='16'
      src='https://img.icons8.com/ios-glyphs/30/FFFFFF/pause--v1.png'
      alt='pause--v1'
    />
  ),
  play: (
    <img
      width='16'
      height='16'
      src='https://img.icons8.com/ios-glyphs/30/FFFFFF/play--v1.png'
      alt='play--v1'
    />
  ),
  next: (
    <img
      width='16'
      height='16'
      src='https://img.icons8.com/ios-glyphs/30/FFFFFF/end--v1.png'
      alt='end--v1'
    />
  ),
  back: (
    <img
      width='16'
      height='16'
      src='https://img.icons8.com/ios-glyphs/30/FFFFFF/skip-to-start--v1.png'
      alt='skip-to-start--v1'
    />
  ),
  exit: (
    <img
      width='30'
      height='30'
      src='https://img.icons8.com/ios-glyphs/30/FFFFFF/so-so.png'
      alt='so-so'
    />
  ),
};

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
  const [artist, setArtist] = useState([]);
  const [artistId, setArtistId] = useState('');

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
        const [userData, playbackData, artistData] = await Promise.all([
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

        setProgress_ms(playback.progress_ms);
        setDuration_ms(playback.item?.duration_ms);
        setSong_name(playback.item?.name);
        setArtist_name(playback.item?.artists?.[0]?.name);
        setAlbum_name(playback.item?.album?.name);
        setAlbum_art(playback.item?.album?.images?.[0]?.url);
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
    console.log(token);
    console.log(playback.item?.artists?.[0]?.id);
  };

  const pausePlayback = async () => {
    const { data } = await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/pause?device_id=${playback.device.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const pauseData = await data;

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
          {token && user ? (
            <div className='flex-row'>
              {user.images && user.images.length > 0 ? (
                <img src={user.images?.[0].url} alt='' />
              ) : null}
            </div>
          ) : null}
          <h1>reactify</h1>
          <button onClick={logout}>
            <motion.div
              initial={{ rotate: -360 }}
              whileHover={{ rotate: 0 }}
              transition={{ type: 'spring' }}
            >
              {icon.exit}
            </motion.div>
          </button>
        </div>
      )}

      {token && playback ? (
        <div className='flex-column'>
          <img
            className='album-art'
            src={playback.item?.album?.images?.[0]?.url}
            alt='album artwork'
          />

          <div>
            <p className='song-name'>{playback.item.name}</p>
            <p className='artist-name'>{playback.item.artists[0].name}</p>
            {/* <p className=''>{playback.item?.album?.name}</p> */}
          </div>
        </div>
      ) : null}
      <div className='flex-row'>
        {token && playback ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={prevTrack}
          >
            {icon.back}
          </motion.button>
        ) : null}
        {token && playback ? (
          <div>
            {playback.is_playing ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={pausePlayback}
              >
                {icon.pause}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={playPlayback}
              >
                {icon.play}
              </motion.button>
            )}
          </div>
        ) : null}
        {token && playback ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={nextTrack}
          >
            {icon.next}
          </motion.button>
        ) : null}
        {user && playback ? (
          <button className='log-data' onClick={logData}>
            ?
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default App;

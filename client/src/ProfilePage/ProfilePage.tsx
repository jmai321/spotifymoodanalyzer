import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Song } from '../types';
import ValenceSongChart from './ValenceSongChart/ValenceSongChart';
import EnergySongChart from './EnergyGraph/EnergyGraph';
import Instrumentalness from './InstrumentalnessGraph/Instrumentalness';
import LivenessGraph from './LivenessGraph/LivenessGraph';
import Acousticness from './AcousticnessGraph/AcousticnessGraph';
import Danceability from './DanceabilityGraph/Danceability';

interface User {
  display_name: string;
}

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState<Song[] | null>(null);
  const [selectedTrait, setSelectedTrait] = useState('valence');

  const fetchRecentlyPlayedSongs = () => {
    axios.get<Song[]>(`${process.env.REACT_APP_BACKEND_URL}/songs`, { withCredentials: true })
      .then(response => {
        setRecentlyPlayedSongs(response.data);
      })
      .catch(error => {
        console.error('Error fetching recently played songs:', error);
        setRecentlyPlayedSongs([]);
      });
  };

  const fetchAndSaveSongs = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch-and-save-songs`, { withCredentials: true })
      .then(() => {
        fetchRecentlyPlayedSongs();
      })
      .catch(error => {
        console.error('Error triggering fetch-and-save-songs:', error);
      });
  };

  useEffect(() => {
    axios.get<User>(`${process.env.REACT_APP_BACKEND_URL}/user`, { withCredentials: true })
      .then(response => {
        setUserName(response.data.display_name);
        fetchAndSaveSongs();
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const traitButtonClass = (trait: string) =>
    `px-4 py-2 rounded transition-colors duration-300 font-semibold ${
      selectedTrait === trait ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300'
    } hover:bg-purple-600 hover:text-white`;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto py-4">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-purple-400">SpotiData</h1>
          <p className="text-gray-400">Welcome, {userName}</p>
        </header>
        <div className="flex justify-center space-x-2 mb-6">
          <button onClick={() => setSelectedTrait('valence')} className={traitButtonClass('valence')}>Valence</button>
          <button onClick={() => setSelectedTrait('energy')} className={traitButtonClass('energy')}>Energy</button>
          <button onClick={() => setSelectedTrait('acousticness')} className={traitButtonClass('acousticness')}>Acousticness</button>
          <button onClick={() => setSelectedTrait('instrumentalness')} className={traitButtonClass('instrumentalness')}>Instrumentalness</button>
          <button onClick={() => setSelectedTrait('liveness')} className={traitButtonClass('liveness')}>Liveness</button>
          <button onClick={() => setSelectedTrait('danceability')} className={traitButtonClass('danceability')}>Danceability</button>
        </div>
        <main>
          {selectedTrait === 'valence' && recentlyPlayedSongs && <ValenceSongChart songs={recentlyPlayedSongs} />}
          {selectedTrait === 'energy' && recentlyPlayedSongs && <EnergySongChart songs={recentlyPlayedSongs} />}
          {selectedTrait === 'acousticness' && recentlyPlayedSongs && <Acousticness songs={recentlyPlayedSongs} />}
          {selectedTrait === 'instrumentalness' && recentlyPlayedSongs && <Instrumentalness songs={recentlyPlayedSongs} />}
          {selectedTrait === 'liveness' && recentlyPlayedSongs && <LivenessGraph songs={recentlyPlayedSongs} />}
          {selectedTrait === 'danceability' && recentlyPlayedSongs && <Danceability songs={recentlyPlayedSongs} />}
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;

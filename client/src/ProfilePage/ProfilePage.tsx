import React, { useEffect, useState } from 'react';
import ValenceSongChart from './ValenceSongChart/ValenceSongChart';
import axios from 'axios';
import { Song } from '.././types';


interface User {
    display_name: string;
}

const ProfilePage: React.FC = () => {
    const [userName, setUserName] = useState<string>('');
    // Initialize recentlyPlayedSongs as null to indicate loading state
    const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState<Song[] | null>(null);

    const fetchRecentlyPlayedSongs = () => {
        axios.get<Song[]>(`${process.env.REACT_APP_BACKEND_URL}/songs`, { withCredentials: true })
            .then(response => {
                setRecentlyPlayedSongs(response.data);
            })
            .catch(error => {
                console.error('Error fetching recently played songs:', error);
                setRecentlyPlayedSongs([]); // Set to empty array in case of error
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

    return (
        <div>
            {recentlyPlayedSongs && <ValenceSongChart songs={recentlyPlayedSongs} />}
        </div>
    );
}

export default ProfilePage;

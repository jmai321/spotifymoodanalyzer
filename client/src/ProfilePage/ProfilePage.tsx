import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    display_name: string;
    // Add other user properties you might need
}

interface Song {
    id: number;
    spotifyTrackId: string;
    name: string;
    artist: string; 
    valence: number;
    playedAt: string;
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

    const refreshSongs = () => {
      setRecentlyPlayedSongs(null); // Set to null to show loading state
      fetchAndSaveSongs();
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
            <p className="text-2xl mb-4">{userName ? `Welcome, ${userName}` : 'Loading user data...'}</p>
            <div>
                <h2 className="text-xl font-bold mb-2">Recently Played Songs:</h2>
                <button onClick={refreshSongs}>Refresh Songs</button>
                {recentlyPlayedSongs === null ? (
                    <p>Loading songs...</p> // Loading message
                ) : recentlyPlayedSongs.length > 0 ? (
                    <ul>
                        {recentlyPlayedSongs.map(song => (
                            <li key={song.id}>
                                <p>Song: {song.name}</p>
                                <p>Artist: {song.artist}</p>
                                <p>Valence: {song.valence}</p>
                                <p>Played At: {new Date(song.playedAt).toLocaleString()}</p>
                                <hr className="my-2" />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recently played songs.</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;

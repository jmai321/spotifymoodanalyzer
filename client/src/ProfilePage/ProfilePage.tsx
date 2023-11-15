import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('spotifyAuthToken');
    if (token) {
      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUserName(response.data.display_name);
      })
      .catch(error => console.log(error));
    }
  }, []);

  return (
    <div>
      {userName ? <p>Welcome, {userName}</p> : <p>Loading...</p>}
    </div>
  );
}

export default ProfilePage;

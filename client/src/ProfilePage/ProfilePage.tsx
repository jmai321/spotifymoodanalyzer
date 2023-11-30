import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, { withCredentials: true })
      .then(response => {
        setUserName(response.data.display_name);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {userName ? <p>Welcome, {userName}</p> : <p>Loading...</p>}
    </div>
  );
}

export default ProfilePage;

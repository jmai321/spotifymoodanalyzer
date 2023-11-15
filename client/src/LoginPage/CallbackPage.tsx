import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      localStorage.setItem('spotifyAuthToken', token);
      navigate('/user-profile'); // Navigate to user profile
    }
  }, [location, navigate]);

  return <div>Logging in...</div>;
}

export default CallbackPage;

import React from 'react';
import './styles.css';

const LoginPage: React.FC = () => {
  const CLIENT_ID: string = '2a8a5680e0ab42ed81c26bccd9e48263'; // Client ID
  const REDIRECT_URI: string = 'http://localhost:3000/callback'; // Redirect URI
  const AUTH_ENDPOINT: string = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE: string = 'token';
  const SCOPES: string = 'user-read-private';

  const handleLogin = (): void => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
  };

  return (
    <div>
      <head>
        <link rel="stylesheet" href="./styles.css" />
      </head>
      <div className="LoginPage">
        <div id="login-container">
          <div className="login">
            <h1>Login</h1>
            <button id="login-button" className="big-btn" onClick={handleLogin}>Log in with Spotify</button>
            <p className="login-desc">Connect your Spotify Account.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

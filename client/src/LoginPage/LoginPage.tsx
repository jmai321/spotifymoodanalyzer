import React from 'react';
import './styles.css'
import { redirectToSpotifyAuthService } from './spotifyAuth';

function LoginPage() {
  return (
    <div>
      <head>
        <link rel="stylesheet" href="./styles.css" />
      </head>
      <div className="LoginPage">
        <div id="login-container">
          <div className="login">
            <h1>Login</h1>
            <button id="login-button" className="big-btn">Log in with Spotify</button>
            <p className="login-desc">Connect your Spotify Account.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

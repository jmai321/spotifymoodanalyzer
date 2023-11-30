import React from 'react';
import './styles.css';

const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    window.location.href = 'http://localhost:6000/login';
  };

  return (
    <div className="LoginPage">
      <div id="login-container">
        <div className="login">
          <h1>Login</h1>
          <button id="login-button" className="big-btn" onClick={handleLogin}>Log in with Spotify</button>
          <p className="login-desc">Connect your Spotify Account.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

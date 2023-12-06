import React from 'react';

const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-green">
      <div className="bg-opacity-50 bg-black text-white text-center p-14 rounded-lg">
        <h1 className="text-2xl mb-12 mt-0">Login</h1>
        <button
          id="login-button"
          className="bg-purple-700 text-white text-lg py-3 px-12 rounded-full transition duration-300 transform hover:scale-105"
          onClick={handleLogin}
        >
          Log in with Spotify
        </button>
        <p className="text-sm mt-5">Connect your Spotify Account.</p>
      </div>
    </div>
  );
};

export default LoginPage;

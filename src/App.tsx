import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles.css'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

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
            <p className="login-desc-small">You will automatically be redirected to this page after login.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default App;
export default LoginPage;

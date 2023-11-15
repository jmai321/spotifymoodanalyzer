import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import CallbackPage from './LoginPage/CallbackPage';
import ProfilePage from './ProfilePage/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/user-profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;

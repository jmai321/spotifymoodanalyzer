import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import ProfilePage from './ProfilePage/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;

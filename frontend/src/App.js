import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Questions from './pages/questions';
import User from './pages/user';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;

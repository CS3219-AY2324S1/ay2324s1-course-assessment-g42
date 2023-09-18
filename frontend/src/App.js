import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Questions from './pages/questions';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;

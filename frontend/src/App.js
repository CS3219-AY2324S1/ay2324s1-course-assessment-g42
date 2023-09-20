import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Questions from './pages/questions';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;

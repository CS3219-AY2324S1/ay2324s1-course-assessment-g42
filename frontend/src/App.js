import './App.css';
import React, {useEffect, useState} from 'react';

function App() {

  const [backendData, setBackendData] = useState('');

  useEffect(() => {
    fetch("/test").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, []);

  return (
    <div className="App">
      <p>PeerPrep slay!!!!</p>
      {(typeof backendData == 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <p>{backendData}</p>
    )}
    </div>
  );
}

export default App;

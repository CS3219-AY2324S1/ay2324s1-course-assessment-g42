import '../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {

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
      <p>peerprep WOO</p>
      {(typeof backendData == 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <p>
          {backendData}<br />
          <Link to='/questions'>Question Repository</Link> |
          Another page here
          <Link to='/user'>register</Link>
        </p>
      )}
    </div>
  );
}

export default Home;

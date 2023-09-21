import '../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {

  const [backendData, setBackendData] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/test").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
    //check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn, setBackendData]);

  return (
    <div className="App">
      <p>peerprep WOO</p>
      {(typeof backendData == 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <p>
          {backendData}<br />
          <Link to='/questions'>Question Repository</Link> 
          |
          {isLoggedIn ? (
            <><Link to='/userProfile'>User Profile</Link></>
          ) : (
            <>
            <Link to='/login'>Login</Link> |
            <Link to='/signup'>Sign Up</Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default Home;

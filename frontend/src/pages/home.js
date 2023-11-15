import '../App.css';
import React, { useState, useLayoutEffect } from 'react'

import Cookies from 'js-cookie';
import HomePage from '../components/home/homePage';
import LandingPage from '../components/home/landingPage';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useLayoutEffect(() => {
    const loggedInUser = Cookies.get('user');
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

    return (
      isLoggedIn
      ? <HomePage />
      : <LandingPage />
    );
}

export default Home;

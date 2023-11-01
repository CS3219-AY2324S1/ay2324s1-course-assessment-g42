import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { standardToast } from '../styles/toastStyles';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from '@mui/icons-material/Warning';
import { logout } from '../helpers';

import FormLanguageSelect from '../components/match/formLanguageSelect';
import FormComplexitySelect from '../components/questions/formComplexitySelect';
import { MATCH_API_URL } from '../config';


function Match() {
  const navigate = useNavigate();
  const [complexity, setComplexity] = useState("Easy");
  const [language, setLanguage] = useState("JavaScript");
  const [isMatching, setIsMatching] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isMatchingComplete, setIsMatchingComplete] = useState(false);
  const [username, setUsername] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResponseReceived, setIsResponseReceived] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    if (!loggedInUser) {
      
      toast.error("Not signed in!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      toast.clearWaitingQueue();
      navigate('/login');
      return;
    }
    setUsername(JSON.parse(loggedInUser).username);
    
  }, [navigate]);

  useEffect(() => {
    if (isMatchingComplete && !isMatching && isResponseReceived && roomId !== null) {
      navigate('/collab', {state : {roomId : roomId, complexity : complexity, language : language}})
    }
  }, [isMatchingComplete, isMatching, isResponseReceived, roomId, complexity, language, navigate]);

  const sendMatchingRequest = () => {
    if (isMatching) {
      return ;
    }
    setResponseMessage('');
    setTimeLeft(30);
    setIsMatching(true);
    setIsResponseReceived(false);
    const timeOfReq = new Date().getTime();

    axios.post(MATCH_API_URL + '/match/find-match'
                , { username, complexity, language, timeOfReq }
                , { withCredentials: true, credentials: 'include' })
        .then(response => { 
          setIsMatching(false);
          const res = response.data;
          console.log(response.data)
          console.log(response.data.roomId)
          setResponseMessage(res.message);
          setRoomId(res.roomId);
          setIsMatchingComplete(true);
          setIsResponseReceived(true);
          
        })
        .catch(error => {
          if (error.response.status === 401) {
            navigate('/');
            logout();
    
            console.log("Unauthorized access. Logged out.");
            toast.error("Unauthorized access.", standardToast);
    
            return;
          }
          console.log('Ran into error while requesting match: ', error);
        });
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 0) {
          return prevTimeLeft - 1;
        } else {
          clearInterval(timer); // Stop the timer when time runs out
          setIsMatching(false);
          setIsMatchingComplete(true);
          return 0;
        }
      });
    }, 1000);
  }

  return (
    <div className="wrapper">
      <h1>Matching service</h1>
      <h2>1. Choose your preferred difficulty level</h2>
      <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
      <h2>2. Choose your preferred programming language</h2>
      <FormLanguageSelect language={language} setLanguage={setLanguage} />
      <h2>3. Find a match (this may take up to 30 seconds)</h2>
      <Button variant="contained" onClick={sendMatchingRequest}>Match me!</Button>
      {isMatching ? (
          <CircularProgress size={30} sx={{
          position: 'relative',
          left: 20,
          top: 10
          }}/> 
        ) : <br></br>}
      {isMatching ? <p>Waiting for a match... Time left: {timeLeft} seconds</p> : null}
      {isMatching ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon></WarningIcon>
          <p>Please do not leave this page while waiting for your match.</p> 
        </div>
        ) : ''}
      {isMatchingComplete & !isMatching ? (
        isResponseReceived ? (<p>{responseMessage}</p>)
        : (<p>Server took too long to respond!</p>)
        )
        : ''}
    </div>
  );
}

export default Match;

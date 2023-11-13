import '../App.css';
import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from '@mui/icons-material/Warning';

import MatchLanguageSelect from '../components/match/matchLanguageSelect';
import MatchComplexitySelect from '../components/match/matchComplexitySelect';
import { Grid } from '@mui/material';
import matchingImage1 from '../images/matching_1.png';

import io from 'socket.io-client';
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
  const socketRef = useRef();

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
    // connect to socket
    if (socketRef.current == null) {
      socketRef.current = io(MATCH_API_URL,  { transports : ['websocket'] });
    }
    socketRef.current.on('match-found', (roomId, message) => {
      setResponseMessage(message);
      setRoomId(roomId);
      setIsMatching(false);
      setIsMatchingComplete(true);
      setIsResponseReceived(true);
      navigate('/collab', {state : {roomId : roomId, complexity : complexity, language : language}})
    });
    socketRef.current.on('duplicate-request', (message) => {
      setResponseMessage(message);
      setIsMatching(false);
      setIsMatchingComplete(true);
      setIsResponseReceived(true);
    });
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
    
    socketRef.current.emit('find-match', username, complexity, language, timeOfReq);

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
    <div className="matching-container">
      <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="center">
        <Grid item xs={6} className="image-container">
          <img src={matchingImage1} alt="matching_1" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Grid>
        <Grid item xs={6} style={{ margin: '0 auto' }}>
          <p className='match-title-text'>
            Find me a match!
          </p>
          <div className="rounded-black-box">
            <p className='match-body-text'>
              1. Choose your question difficulty
            </p>
              <MatchComplexitySelect
                complexity={complexity}
                setComplexity={setComplexity}
              />
            <p className='match-body-text'>
              2. Choose your programming language
            </p>
              <MatchLanguageSelect language={language} setLanguage={setLanguage}                 
              />
            <p className='match-body-text'>
              3. Find a partner to learn with!
            </p>
            <div className='match-form-container'>
              <Button
                  variant="contained"
                  onClick={sendMatchingRequest}
                  style={{ backgroundColor: '#F24E1E', color: 'black', padding: '10px', marginLeft: '10px' }}
              >
                Start Match!
              </Button>
              {isMatching ? (
                  <CircularProgress size={30} sx={{
                  position: 'relative',
                  left: 20,
                  top: 10
                  }}/> 
                ) : <br></br>
              }
              <div>
                {isMatching ? <p> 
                  Time Elapsed: {timeLeft} seconds</p> : null
                }
              </div>
              {isMatching ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon style={{ marginRight: '8px' }}></WarningIcon>
                  <p> Please do not leave this page while waiting for your match.</p> 
                </div>
                ) : ''
              }
              {isMatchingComplete & !isMatching ? (
                isResponseReceived ? (<p>{responseMessage}</p>)
                : (<p>No match was found! Try again later.</p>)
                )
                : ''
              }
            </div>
          </div>
          <p className='match-sub-text'>
            * You will be redirected to a room if a match is found within 30 seconds.
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

export default Match;

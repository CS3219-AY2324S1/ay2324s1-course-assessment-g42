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

import MatchLanguageSelect from '../components/match/matchLanguageSelect';
import MatchComplexitySelect from '../components/match/matchComplexitySelect';
import { MATCH_API_URL } from '../config';
import { Grid } from '@mui/material';
import matchingImage1 from '../images/matching_1.png';


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
            * Queue will be terminated if no match is found in 30 seconds.
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

export default Match;

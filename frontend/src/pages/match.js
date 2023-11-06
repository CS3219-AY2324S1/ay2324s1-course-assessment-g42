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
import { Grid } from '@mui/material';

import matchingImage1 from '../images/matching_1.png';


function Match() {
  const navigate = useNavigate();
  const [complexity, setComplexity] = useState("Easy");
  const [language, setLanguage] = useState("javascript");
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
      navigate(`/collab/${roomId}/${complexity}/${language}`);
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
          <img src={matchingImage1} alt="matching_1" style={{ maxWidth: '1000px', maxHeight: '1000px' }} />
        </Grid>
        <Grid item xs={6} style={{ margin: '0 auto' }}>
          <p className='match-title-text'>
            Find me a match!
          </p>
          <div className="rounded-black-box">
            <p className='match-body-text'>
              1. Choose your question difficulty
            </p>
            <div className="match-form-box">
              <FormComplexitySelect
                complexity={complexity}
                setComplexity={setComplexity}
                style={{
                  minWidth: '180px',
                }}
                showLabel={false}
              />
            </div>
            <p className='match-body-text'>
              2. Choose your programming language
            </p>
            <div className="match-form-box">
              <FormLanguageSelect language={language} setLanguage={setLanguage}                 
                style={{
                  minWidth: '180px',
                }}
                showLabel={false}
              />
            </div>
            <p className='match-body-text'>
              3. Find a partner to learn with!
            </p>
            <Button
                variant="contained"
                onClick={sendMatchingRequest}
                style={{ backgroundColor: '#F24E1E', marginLeft: '60px', color: 'black', padding: '10px' }}
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

              {isMatching ? <p style={{ marginLeft: '60px' }}> 
                Time Elapsed: {timeLeft} seconds</p> : null
              }

              {isMatching ? (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
                  <WarningIcon></WarningIcon>
                  <p> Please do not leave this page while waiting for your match.</p> 
                </div>
                ) : ''
              }

              {isMatchingComplete & !isMatching ? (
                isResponseReceived ? (<p style={{ marginLeft: '40px' }}>{responseMessage}</p>)
                : (<p style={{ marginLeft: '40px' }}>No match was found! Try again later.</p>)
                )
                : ''
              }
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

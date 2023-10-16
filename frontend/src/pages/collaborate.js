import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from '@mui/icons-material/Warning';

import FormComplexitySelect from '../components/questions/formComplexitySelect';


function Collaborate() {
  const navigate = useNavigate();
  const [complexity, setComplexity] = useState("Easy");
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUsername, setMatchedUsername] = useState('');
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [isMatchingComplete, setIsMatchingComplete] = useState(false);


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
    
  }, [navigate]);

  const user = Cookies.get('user')
  const userObj = JSON.parse(user)
  const username = userObj.username

  const sendMatchingRequest = () => {
    if (isMatching) {
      return ;
    }
    setIsMatching(true);
    const apiUrl = '/collaborate/api/match'; // Replace with your actual URL

    // Define the data to send in the request body
    const data = { username, complexity };
    console.log('sending matching request from frontend')


    // Use Axios to send the POST request
    axios.post(apiUrl, data)
        .then(response => { 
          console.log(response.data + '!!!');
          setIsMatching(false);
          setMatchedUsername(response.data);
          if (response.data !== 'no match') {
            setIsMatchFound(true);
          }
          setIsMatchingComplete(true);
        })
        .catch(error => {
            console.log('ran into error while requesting match')
            console.log(error)
        });
  }

  return (
    <div className="wrapper">
      <h1>Matching service</h1>
      <h2>1. Choose your preferred difficulty level</h2>
      <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
      <h2>2. Find a match (this may take up to 30 seconds)</h2>
      <Button variant="contained" onClick={sendMatchingRequest}>Match me!</Button>
      {isMatching ? (
          <CircularProgress size={30} sx={{
          position: 'relative',
          left: 20,
          top: 10
          }}/> 
        ) : <br></br>}
      {isMatching ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon></WarningIcon>
          <p>Please do not leave this page while waiting for your match.</p> 
        </div>
        ) : ''}
      {isMatchingComplete & !isMatching ? (
        isMatchFound ? (<p>You were matched with {matchedUsername}!</p>)
        : (<p>We couldn't find a match for you! Try again in a while.</p>)
        )
        : ''}
    </div>
  );
}

export default Collaborate;

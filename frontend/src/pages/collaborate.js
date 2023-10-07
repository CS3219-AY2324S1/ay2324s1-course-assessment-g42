import '../App.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import FormComplexitySelect from '../components/questions/formComplexitySelect';


function Collaborate() {
  const navigate = useNavigate();
  const [complexity, setComplexity] = useState("Easy");
  const [isMatching, setIsMatching] = useState(false)


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


  return (
    <div className="wrapper">
      <h1>Matching service</h1>
      <h2>1. Choose your preferred difficulty level</h2>
      <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
      <h2>2. Find a match (this may take up to 30 seconds)</h2>
      <Button variant="contained" onClick={setIsMatching}>Match me!</Button>
      {isMatching ? (<CircularProgress size={30} sx={{
          position: 'relative',
          left: 20,
          top: 10
        }}/>) : <br></br>}
    </div>
  );
}

export default Collaborate;

import '../App.css';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { standardButton } from '../styles/muiButtonStyles';

function Home() {
  const navigate = useNavigate();

  const handleToRegister = () => {
    navigate('/signup');
  }

    return (
        <div className="grad-box">
            <p className="home-title-text">A Better Way to Learn</p>
            <p>PeerPrep offers a collaborative space to enhance skills, improve communication of concepts,
              and prepare for technical interviews.</p>
            <div style={{ marginTop: "30px" }}>
              <Button style={standardButton} onClick={handleToRegister}>Register Now!</Button>
            </div>
        </div>
    );
}

export default Home;

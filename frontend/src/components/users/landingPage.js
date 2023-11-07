import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';

import { standardButton } from '../../styles/muiButtonStyles';

import landingImage1 from '../../images/landing_1.png';
import landingImage2 from '../../images/landing_2.png';
import landingImage3 from '../../images/landing_3.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleToRegister = () => {
    navigate('/signup');
  }
  return (
    <>
      <div className="grad-box">
          <p className="home-title-text">A Better Way to Learn</p>
          <p>PeerPrep offers a collaborative space to enhance skills, improve communication of concepts,
            and prepare for technical interviews.</p>
            <div style={{ marginTop: "30px" }}>
              <Button style={standardButton} onClick={handleToRegister}>Register Now!</Button>
            </div>
      </div>

      {/* Row with two pictures */}
      <div style={{ marginTop: "30px" }}>
        <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={3}>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <img src={landingImage1} alt="landing_1" style={{ maxWidth: '300px', maxHeight: '300px' }}/>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div style={{ paddingRight: '80px' }}>
              <p className="home-orange-heading">Thousands of Questions at your Fingertips</p>
              <p className="home-caption-text">
                PeerPrep offers thousands of questions for you to practice. Come join the
                PeerPrep community and challenge yourself with our range of difficulties and topics.
              </p>
            </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <img src={landingImage2} alt="landing_2" style={{ maxWidth: '300px', maxHeight: '300px' }}/>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div style={{ paddingRight: '80px' }}>
              <p className="home-orange-heading">Collaboration with Peers</p>
              <p className="home-caption-text">
                Join our community of like-minded coders, and learn to communicate concepts as you
                take on questions together.
              </p>
            </div>
          </Grid>
        </Grid>
      </div>

      {/** Row with one picture */}
      <div className="center-column-wrapper">
        <img src={landingImage3} alt="landing_3" style={{ maxWidth: '300px', maxHeight: '300px'}}/>
        <div className='center-column-body-wrapper'>
          <p className="home-orange-heading">Made with ❤️ in Singapore</p>
          <span align="center" className="home-caption-text">
            As university students united under PeerPrep, our mission is to create a platform that
            empowers fellow students to effortlessly navigate the technical interview process and secure
            their dream jobs. With a substantial question bank, real-time collaboration features, and
            our first hand experience as students seeking technical positions, we are committed to
            making this vision a reality.
          </span>
        </div>
      </div>
    </>
  );
}

export default LandingPage;

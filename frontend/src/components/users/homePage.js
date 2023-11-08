import '../../App.css';
import React from 'react';
import QuestionHistory from "./questionHistory";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';

import homeImage1 from '../../images/home_1.png';
import homeImage2 from '../../images/home_2.png';

function HomePage() {
  return (
    <>
      <div className='rounded-outline-box'>
        <QuestionHistory />
      </div>     
      <div>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={4}>
            <div className='home-heading-wrapper'>
              <img src={homeImage1} alt="home_1" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
              <span align='center' className='home-heading'>Work with a friend and take that step towards your dream job.</span>
              <div style={{marginBottom: "10px"}}>
                <Button
                  variant="contained"
                  component={Link} to="/match"
                  style={{ backgroundColor: '#F24E1E', color: 'black', padding: '10px' }}
                >
                  Start Collaborating!
                </Button>
              </div>                       
            </div>            
          </Grid>
          <Grid item xs={4}>
            <div className='home-heading-wrapper'>
              <img src={homeImage2} alt="home_2" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
              <span align='center' className='home-heading'>Challenge yourself with one of our challenging questions!</span>                
              <div style={{marginBottom: "10px"}}>
                <Button
                  variant="contained"
                  component={Link} to="/questions/1"
                  style={{ backgroundColor: '#F24E1E', color: 'black', padding: '10px' }}
                >
                  View Questions
                </Button>
              </div>
            </div>            
          </Grid>
        </Grid>      
      </div>      
    </>    
  );
}

export default HomePage;

import '../../App.css';
import React from 'react';
import QuestionHistory from "./questionHistory";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <>
      <QuestionHistory />
      <Button
          variant="contained"
          component={Link} to="/match"
          style={{ backgroundColor: '#F24E1E', color: 'black', padding: '10px', marginLeft: '10px' }}
      >
        Start Collaborating!
      </Button>
      <Button
          variant="contained"
          component={Link} to="/questions/1"
          style={{ backgroundColor: '#F24E1E', color: 'black', padding: '10px', marginLeft: '10px' }}
      >
        View Questions
      </Button>
    </>
    
  );
}

export default HomePage;

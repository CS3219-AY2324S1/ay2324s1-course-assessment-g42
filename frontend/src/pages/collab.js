import '../App.css';
import '../styles/collab.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import MonacoEditor from 'react-monaco-editor';

import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL } from '../config';
import { logout } from '../helpers';
import { RenderedDescription, DifficultyText } from '../helpers/questionFormatters';

function Collab() {
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // get questions from database
    axios.post(
      QUESTION_API_URL + "/question/getQuestionById",
      { id: 1 },
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {       
      setQuestion(response.data)
    })
    .catch(error => {
      if (error.response.status === 401) {
        navigate('/');
        logout();
        console.log("Unauthorized access. Logged out.");
        toast.error("Unauthorized access.", standardToast);
        return;
      }
      if (error.response.status === 404) {
        console.log("Could not find the question.");
        toast.error("Could not find the question.", standardToast);
        return;
      }
      if (error.response.status === 500) {
        console.log("There was an error loading the question.");
        toast.error("There was an error loading the question.", standardToast);
        return;
      }
    console.error(error)});
  }, [navigate])

  return (
    <div>
    {
      question &&
      <div className="collab-wrapper">
      <Grid container spacing={2}>
        {/* Left side of page */}
        <Grid item xs={5} style={{height: '85vh'}}>
          <div className="collab-section-header">
            Description
          </div>
          <div className="collab-question-content">
            <b className="question-title">{question.id}. {question.title}</b>
            <br />
            <DifficultyText difficulty={question.complexity} />
            <br />
            {question.categories.map((category) => (
              <Chip key={category} label={category} style={{ height: "25px" }}></Chip>
            ))}
            <RenderedDescription text={question.description} />
          </div>

        </Grid>

        {/* Right side of page */}
        <Grid item xs={7} style={{maxHeight: '85vh', overflow: 'auto'}}>
          <div className="collab-section-header">
            Javascript
          </div>
          <div className="collab-editor-content">
            <MonacoEditor
              height="100%"
              width="100%"
              language="javascript"
            />
          </div>

          {/* Chat and video call */}
          <Grid container spacing={2} style={{height: "31%"}}>
            <Grid item xs={6} style={{marginTop: "10px", maxHeight: "94%"}}>
              <div className="collab-section-header">
                Chat
              </div>
              <div className="collab-chat-content">
                u r matched with (some user)
              </div>
            </Grid>
            <Grid item xs={6} style={{marginTop: "10px", maxHeight: "94%"}}>
              <div className="collab-section-header">
                Video Call
              </div>
              <div className="collab-chat-content">
                :)
              </div>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </div>
    }
    </div>
  );
}

export default Collab;
import '../App.css';
import '../styles/collab.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

import { Button, Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import MonacoEditor from 'react-monaco-editor';

import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL } from '../config';
import { logout } from '../helpers';
import { RenderedDescription, DifficultyText } from '../helpers/questionFormatters';

function Collab() {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  const socketRef = useRef();
  const navigate = useNavigate();
  const { roomId, qnComplexity, language } = useParams();
  const [matchedUser, setMatchedUser] = useState(null);
  const [isPartner, setIsPartner] = useState(true);

  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  }

  const handleChange = (value, event) => {
    setCode(value);
    socketRef.current.emit('code-change', roomId, value);
  }

  const handleDisconnect = () => {
    socketRef.current.emit('disconnect-client', roomId, user);
    console.log("client disconnected")
    navigate('/');
  }

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    if (!loggedInUser) {
      
      toast.error("Not signed in!", standardToast);
      toast.clearWaitingQueue();
      navigate('/login');
      return;
    }
    const username = JSON.parse(loggedInUser).username;
    setUser(username);
    let randomId = null;
  
    socketRef.current = io('http://localhost:5002',  { transports : ['websocket'] });

    console.log(roomId);
    socketRef.current.emit('join-room', roomId, username, language);

    socketRef.current.on('invalid-user', () => {
      toast.error("You cannot access this room!", standardToast);
      navigate('/');
      return;
    })

    socketRef.current.on('connect', () => {
      axios.post(
        QUESTION_API_URL + "/question/getQuestionByComplexity",
        { complexity: qnComplexity },
        { withCredentials: true, credentials: 'include' }
      )
      .then(response => {       
        randomId = response.data;
        socketRef.current.emit('generate-question', roomId, randomId);
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
    })

    socketRef.current.on('get-info', (room) => {
      if (room.user1 !== null && room.user1 !== username) {
        setMatchedUser(room.user1);
        setIsPartner(room.isUser1Present);
      } else if (room.user2 !== null && room.user2 !== username) {
        setMatchedUser(room.user2);
        setIsPartner(room.isUser2Present);
      }

    })

    socketRef.current.on('generate-question', (qnId) => {
      if (qnId !== randomId) {
        randomId = qnId;
      }
      axios.post(
        QUESTION_API_URL + "/question/getQuestionById",
        { id: qnId },
        { withCredentials: true, credentials: 'include' }
      )
      .then(response => {       
        setQuestion(response.data)
        socketRef.current.emit('get-info', roomId);
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
      
    })

    socketRef.current.on('code-change', (newCode) => {
      if (newCode !== code) {
        setCode(newCode);
      }
    });

    socketRef.current.on('inform-disconnect', (disconnectedUser) => {
      // handle prompt on matched user disconnect
      if (disconnectedUser !== username) {
        setIsPartner(false);
        console.log("partner has disconnected");
        toast.info("Partner has disconnected", standardToast);
      }
      
    })

    socketRef.current.on('inform-connect', (connectedUser) => {
      if (connectedUser !== username) {
        setIsPartner(true);
        console.log("partner has connected");
        toast.info("Partner has connected", standardToast);
      }
    })

    // Clean up the socket connection on unmount

    return () => {
      socketRef.current.emit('disconnect-client', roomId, username);
      console.log("client disconnected")
    };
    // Do not remove the next line
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Button variant="contained" onClick={handleDisconnect}>Disconnect</Button>

        </Grid>

        {/* Right side of page */}
        <Grid item xs={7} style={{maxHeight: '85vh', overflow: 'auto'}}>
          <div className="collab-section-header">
            {language}
          </div>
          <div className="collab-editor-content">
          <MonacoEditor
            width="100%"
            height="400"
            language={language}
            value={code}
            editorDidMount={editorDidMount}
            onChange={handleChange}
          />
          </div>

          {/* Chat and video call */}
          <Grid container spacing={2} style={{height: "31%"}}>
            <Grid item xs={6} style={{marginTop: "10px", maxHeight: "94%"}}>
              <div className="collab-section-header">
                Chat
              </div>
              {isPartner
              ?
              <div className="collab-chat-content">
                u r matched with {matchedUser}
              </div>
              : 
              <div className="collab-chat-content">
              {matchedUser} has disconnected
              </div>
              }
              
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
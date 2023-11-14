import '../App.css';
import '../styles/collab.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

import { Grid, Button, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Editor from '@monaco-editor/react';
import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL, HISTORY_API_URL, COLLAB_API_URL } from '../config';
import { logout } from '../helpers/logout';
import { RenderedDescription, DifficultyText } from '../helpers/questionFormatters';
import ChatComponent from '../components/collab/chatComponent';
import LogoutIcon from '@mui/icons-material/Logout';


function Collab() {
  const location = useLocation();
  const [storedQuestion, setStoredQuestion] = useState(null);
  const [code, setCode] = useState('');
  const socketRef = useRef();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [language, setLanguage] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [isPartner, setIsPartner] = useState(true);
  const [isSaved, setSave] = useState(false);
  const [ownUsername, setOwnUsername] = useState(null);
  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  const handleChange = (value, event) => {
    let roomId = room;
    setCode(value);
    //save code changes to session storage
    sessionStorage.setItem(`codeEditor_${roomId}`, code);
    socketRef.current.emit('code-change', room, value);
  }

  const handleSaveThenLeave = () => {
    const loggedInUser = Cookies.get('user');
    const username = JSON.parse(loggedInUser).username;
    sessionStorage.removeItem(`codeEditor_${room}`);
    sessionStorage.removeItem(`matchedUser_${room}`);
    sessionStorage.removeItem(`question_${room}`);

    console.log(code);
    const saveAttempt = {username: username, collaborated: matchedUser, title: storedQuestion.title, qnId: storedQuestion.id, difficulty: complexity, language: language, attempt: code, date: new Date()};
    axios.post(
      HISTORY_API_URL + "/history/saveAttempt",
      saveAttempt,
      { withCredentials: true, credentials: 'include' })
      .then(response => console.log("save successful"))
      .catch(error => console.log("save unsuccessful", error));
    setSave(true);
    socketRef.current.emit('disconnect-client', room, username);
  }
  useEffect(() => { 
    // use local vars because state wont be set on first render
    let roomId = room;
    let qnComplexity = complexity;
    let lang = language;
    if (isSaved) {
      console.log("Attempt saved. You have left the room.");
      toast.info("Attempt saved. You have left the room.", standardToast);
      navigate('/');
      return;
    }

    // have not set state yet
    if (roomId == null || qnComplexity == null || lang == null) {
      if (location.state == null || location.state.roomId == null || location.state.complexity == null || location.state.language == null) {
        toast.error("You cannot access this room!", standardToast);
        console.log("invalid access");
        navigate('/');
        return;
      } else {
        roomId = location.state.roomId;
        qnComplexity = location.state.complexity;
        lang = location.state.language;
        setRoom(roomId);
        setComplexity(qnComplexity);
        setLanguage(lang);
      }
    }
    
    //handle refresh on code editor
    const storedCode = sessionStorage.getItem(`codeEditor_${roomId}`);
    const storedUser = sessionStorage.getItem(`matchedUser_${roomId}`);
    if (storedCode) {
      setCode(storedCode);
    }

    if (storedUser) {
      setMatchedUser(storedUser);
    }
    
    console.log(roomId, qnComplexity, lang);
    const loggedInUser = Cookies.get('user');
    if (!loggedInUser) {
      
      toast.error("Not signed in!", standardToast);
      toast.clearWaitingQueue();
      navigate('/login');
      return;
    }
    const username = (JSON.parse(loggedInUser).username);
    let randomId = null;
    setOwnUsername(username);
  
    socketRef.current = io(COLLAB_API_URL, {
      path: "/collaboration/socket.io",
      transports : ['websocket'] });

    console.log(roomId);
    socketRef.current.emit('join-room', roomId, username, lang);

    socketRef.current.on('invalid-user', () => {
      toast.error("You cannot access this room!", standardToast);
      navigate('/');
      return;
    })

    const storedQuestion = sessionStorage.getItem(`question_${roomId}`);
    let question = JSON.parse(storedQuestion);

    socketRef.current.on('connect', () => {
      if (!question) {
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
      } else {
        setStoredQuestion(question);
      }
    })

    socketRef.current.on('get-info', (room) => {
      if (room.user1 !== null && room.user1 !== username) {
        sessionStorage.setItem(`matchedUser_${roomId}`, room.user1);
        setMatchedUser(room.user1);
        setIsPartner(room.isUser1Present);
      } else if (room.user2 !== null && room.user2 !== username) {
        sessionStorage.setItem(`matchedUser_${roomId}`, room.user2);
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
        sessionStorage.setItem(`question_${roomId}`, JSON.stringify(response.data));
        setStoredQuestion(response.data);
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
        sessionStorage.setItem(`codeEditor_${roomId}`, newCode);
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
      console.log("client disconnected");
    }
    // Do not remove the next line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaved, navigate, location.state])

  // set body background color
  useEffect(()  => {
    document.body.classList.add('collab-bg');
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Would you like to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        document.body.classList.remove('collab-bg');
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);

  
  return (
    <div>
    {
      storedQuestion && !isSaved &&
      <div className="collab-wrapper">
      <Grid container spacing={2}>
        {/* Left side of page */}
        <Grid item xs={5} style={{height: '85vh'}}>
          <div className="collab-section-header">
            Description
          </div>
          <div className="collab-question-content">
            <b className="question-title">{storedQuestion.id}. {storedQuestion.title}</b>
            <Tooltip title="Save attempt and leave collaboration room">
              <Button onClick={handleSaveThenLeave} style={{marginBottom: '1%'}}>
                <LogoutIcon sx={{ fontSize: 24 }}/>
              </Button>
            </Tooltip>
            <br />
            <DifficultyText difficulty={storedQuestion.complexity} />
            <br />
            {storedQuestion.categories.map((category) => (
              <Chip key={category} label={category} style={{ height: "25px" }}></Chip>
            ))}
            <RenderedDescription text={storedQuestion.description} />
          </div>
        </Grid>

        {/* Right side of page */}
        <Grid item xs={7} style={{maxHeight: '85vh', overflow: 'auto'}}>
          <div className="collab-section-header">
            {language}
          </div>
          <div className="collab-editor-content">
          <Editor
            width="100%"
            height="100vh"
            defaultLanguage={language.toLowerCase()}
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
              <div className="collab-chat-content" >
                <ChatComponent roomId={room} username={ownUsername}>
                </ChatComponent>
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
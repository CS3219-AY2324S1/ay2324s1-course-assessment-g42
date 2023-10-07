import '../App.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormDialog from '../components/questions/formDialog.js';
import QuestionsTable from '../components/questions/questionsTable.js';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (questionId) => {
    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    axios.post("/question/deleteQuestion", { id: questionId })
      .then((response) => console.log(response.status))
      .catch(error => {
        if (error.response.status === 401) {
          navigate('/');
          Cookies.remove('user');                
          window.location.reload();
          axios.post("/user/clearCookie");
          
          console.log("Unauthorised Access. Logged out");
          
          toast.error("Unauthorised Access", {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
          });
          
          return;
      }
      console.error(error)});
    setQuestions(updatedQuestions);
  };

  // do setQuestions and also save the questions to database
  const addQuestionToDb = (question) => {
    axios.post("/question/addQuestion", question)
      .then((response) => console.log(response.status))
      .catch(error => {
        if (error.response.status === 401) {
          navigate('/');
          Cookies.remove('user');                
          window.location.reload();
          axios.post("/user/clearCookie");
          
          console.log("Unauthorised Access. Logged out");
          
          toast.error("Unauthorised Access", {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
          });
          
          return;
      }
      console.error(error)});
  };

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    if (!loggedInUser) {
      
      toast.error("Not signed in!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      console.log("Not signed in!");
      toast.clearWaitingQueue();
      navigate('/login');
      return;
    }
    axios.post("/question/getQuestions")
    .then(response => {       
      setQuestions(response.data)
    })
    .catch(error => {
      if (error.response.status === 401) {
        navigate('/');
        Cookies.remove('user');                
        window.location.reload();
        axios.post("/user/clearCookie");
        
        console.log("Unauthorised Access. Logged out");
        
        toast.error("Unauthorised Access", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
        });
        
        return;
    }
    console.error(error)});
    
  }, [navigate]);

  return (
    <div className="wrapper">
      <h1>Questions Repository</h1>
      {/* Button to add a new question */}
      <FormDialog questions={questions} setQuestions={setQuestions} addQuestionToDb={addQuestionToDb} />
      {/* Table displaying questions */}
      <QuestionsTable questions={questions} handleDelete={handleDelete} />
    </div>
  );
}

export default Questions;

import '../App.css';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import FormDialog from '../components/questions/formDialog.js';
import QuestionsTable from '../components/questions/questionsTable.js';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (questionId) => {
    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    axios.post("/question/deleteQuestion", { id: questionId })
      .then((response) => console.log(response.status))
      .catch(error => console.error(error));
    setQuestions(updatedQuestions);
  };

  // do setQuestions and also save the questions to database
  const addQuestionToDb = (question) => {
    axios.post("/question/addQuestion", question)
      .then((response) => console.log(response.status))
      .catch(error => console.error(error));
  };

  useLayoutEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
  })
  useEffect(() => {
      axios.post("/question/getQuestions")
      .then(response => {       
        setQuestions(response.data)
      })
      .catch(error => console.error(error));
    
  }, []);

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

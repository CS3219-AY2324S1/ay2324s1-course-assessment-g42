import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // retrieve questions from database
    const user = localStorage.getItem('user');
    if (!user) {
      navigate("/login");
      return;
    }
    const getUser = JSON.parse(user);
    if (getUser.role == 'admin') {
      axios.post("/question/getQuestions")
      .then(response => {       
        setQuestions(response.data)
      })
      .catch(error => console.error(error));
    } else {
      navigate('/');
      return;
    }
    
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

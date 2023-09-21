import '../App.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import FormDialog from '../components/questions/formDialog.js';
import QuestionsTable from '../components/questions/questionsTable.js';

// helper functions for table
function createQuestion(id, title, description, category, complexity) {
  return { id, title, description, category, complexity };
}

const rows = [
  createQuestion(1, 'Title A', 'Description of A', 'Category 1', 'Low'),
  createQuestion(2, 'Title B', 'Description of B', 'Category 1', 'High'),
  createQuestion(3, 'Title C', 'Description of C', 'Category 2', 'Medium'),
  createQuestion(4, 'Title D', 'Description of D', 'Category 3', 'Medium'),
  createQuestion(5, 'Title E', 'Description of E', 'Category 3', 'High'),
];

function Questions() {
  const [questions, setQuestions] = useState([]);

  // update questions state and store it in a cookie
  const updateQuestionsAndCookie = (newQuestions) => {
    setQuestions(newQuestions);
    Cookies.set('questions', JSON.stringify(newQuestions), { expires: 7 }); // store the data for 7 days
  };

  const handleDelete = (questionId) => {
    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    setQuestions(updatedQuestions);
    Cookies.set('questions', JSON.stringify(updatedQuestions), { expires: 7 });
  };

  // retrieve data from cookies (if there is) when initialized
  useEffect(() => {
    const storedQuestions = Cookies.get('questions');
    if (storedQuestions) {
      // there are questions in the cookies
      setQuestions(JSON.parse(storedQuestions));
    } else {
      // cookies is empty
      setQuestions(rows);
    }
  }, []);

  return (
    <div className="wrapper">
      <h1>Questions Repository</h1>
      {/* Button to add a new question */}
      <FormDialog questions={questions} setQuestions={updateQuestionsAndCookie} createQuestion={createQuestion} />
      {/* Table displaying questions */}
      <QuestionsTable questions={questions} handleDelete={handleDelete} />
    </div>
  );
}

export default Questions;

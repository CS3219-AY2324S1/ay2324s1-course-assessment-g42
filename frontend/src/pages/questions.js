import '../App.css';
import React, { useState } from 'react';

import FormDialog from './questions/formDialog.js';
import QuestionsTable from './questions/questionsTable.js';

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
  const [questions, setQuestions] = useState(rows);

  return (
    <div className="wrapper">
      <h1>Questions Repository</h1>
      {/* Button to add a new question */}
      <FormDialog questions={questions} setQuestions={setQuestions} createQuestion={createQuestion} />
      {/* Table displaying questions */}
      <QuestionsTable questions={questions} />
    </div>
  );
}

export default Questions;

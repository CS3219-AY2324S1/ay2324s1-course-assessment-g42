import '../App.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import FormDialog from '../components/questions/formDialog.js';
import QuestionsTable from '../components/questions/questionsTable.js';
import { logout } from '../helpers';
import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL } from '../config';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const { page } = useParams();
  const pageNumber = parseInt(page) || 1; // default to page one if not a number
  const questionsPerPage = 10;

  const handleDelete = (questionId) => {
    const updatedQuestions = questions.filter((question) => question.id !== questionId);

    axios.post(
      QUESTION_API_URL + "/question/deleteQuestion",
      { id: questionId },
      { withCredentials: true, credentials: 'include' }
    )
      .then((response) => console.log(response.status))
      .catch(error => {
        if (error.response.status === 401) {
          navigate('/');
          logout();

          console.log("Unauthorized access. Logged out.");
          toast.error("Unauthorized access.", standardToast);

          return;
        }

        if (error.response.status === 500) {
          navigate('/');
          logout();

          console.log("An error occurred.");
          toast.error("An error occurred.", standardToast);
          
          return;
        }
      console.error(error)});
    setQuestions(updatedQuestions);
  };

  // do setQuestions and also save the questions to database
  const addQuestionToDb = (question) => {
    axios.post(
      QUESTION_API_URL + "/question/addQuestion",
      question,
      { withCredentials: true, credentials: 'include' }
    )
      .then((response) => console.log(response.status))
      .catch(error => {
        if (error.response.status === 401) {
          navigate('/');
          logout();

          console.log("Unauthorized access. Logged out.");
          toast.error("Unauthorized access.", standardToast);

          return;
        }

        if (error.response.status === 500) {
          navigate('/');

          console.log("An error occurred.");
          toast.error("An error occurred.", standardToast);

          return;
        }
      console.error(error)});
  };

  const handlePageChange = (event, newPage) => {
    navigate(`/questions/${newPage}`);
  };

  useEffect(() => {
    // check if user is logged in
    const loggedInUser = Cookies.get('user');
    if (!loggedInUser) {

      // if not signed in, alert and redirect to login page
      console.log("Not signed in!");
      toast.error("Not signed in!", standardToast);

      toast.clearWaitingQueue();
      navigate('/login');
      return;
    }

    // get questions from database
    axios.post(
      QUESTION_API_URL + "/question/getQuestions",
      { page: pageNumber, pageSize: questionsPerPage },
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {       
      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
    })
    .catch(error => {
      if (error.response.status === 401) {
        navigate('/');
        logout();

        console.log("Unauthorized access. Logged out.");
        toast.error("Unauthorized access.", standardToast);

        return;
      }

      if (error.response.status === 500) {
        navigate('/');

        console.log("There was an error loading the questions.");
        toast.error("There was an error loading the questions.", standardToast);

        return;
      }
    console.error(error)});

  }, [navigate, pageNumber]);

  return (
    <div className="wrapper">
      <h1>Questions Repository</h1>
      {/* Button to add a new question */}
      <FormDialog questions={questions} setQuestions={setQuestions} addQuestionToDb={addQuestionToDb} />
      {/* Table displaying questions */}
      <QuestionsTable questions={questions} handleDelete={handleDelete} />

      {/** Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: "10px" }}>
        <Stack spacing={2}>
          <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  );
}

export default Questions;

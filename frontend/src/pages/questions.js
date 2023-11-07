import '../App.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import QuestionsTable from '../components/questions/questionsTable.js';
import { logout } from '../helpers';
import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL } from '../config';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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
    // Get the new id which is maximum id in database + 1
    axios.get(
      QUESTION_API_URL + "/question/getMaxQuestionId",
      { withCredentials: true, credentials: 'include' }
    )
      .then((response) => {
        const newId = parseInt(response.data.maxQuestionId) + 1;
        console.log(newId)
        question.id = newId;

        // Add the question to the database
        axios.post(
          QUESTION_API_URL + "/question/addQuestion",
          question,
          { withCredentials: true, credentials: 'include' }
        )
          .then((response) =>  {
            console.log(response.status);
            window.location.reload(); // Reload page
            return true;
          })
          .catch(error => {
            if (error.response.status === 401) {
              navigate('/');
              logout();
    
              console.log("Unauthorized access. Logged out.");
              toast.error("Unauthorized access.", standardToast);
    
              return;
            }

            if (error.response.status === 409) {
              console.log("Question title already exists.");
              toast.error("Question title already exists.", standardToast);
    
              return;
            }
    
            if (error.response.status === 500) {
              console.log("An error occurred.");
              toast.error("An error occurred.", standardToast);
    
              return;
            }
          console.error(error)});
      })
      .catch(error => {
        console.error(error);
        toast.error("An error occurred", standardToast);
      })
  };

  const handlePageChange = (event, newPage) => {
    // Check URL for any filter parameters
    const queryString = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    navigate(`/questions/${newPage}${queryString ? `?${queryString}` : ''}`);
  };

  // Filter function to pass down
  const applyFilter = (filterName, filterValue) => {
    var filtersForURL = []; // Use this because filters doesn't change fast enough before URLSearchParams
    if (filterValue === "None") {
      const { [filterName]: removedFilter, ...restFilters } = filters;
      filtersForURL = restFilters;
      setFilters(restFilters);
    } else {
      const updatedFilters = { ...filters, [filterName]: filterValue };
      filtersForURL = updatedFilters;
      setFilters(updatedFilters);
    }

    navigate(`/questions/${page}?${new URLSearchParams(filtersForURL).toString()}`);
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

    const urlSearchParams = new URLSearchParams(location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    setFilters(queryParams);

    // get questions from database
    axios.post(
      QUESTION_API_URL + "/question/getQuestions",
      {
        page: pageNumber,
        pageSize: questionsPerPage,
        complexity: queryParams["complexity"],
        category: queryParams["category"],
        title: queryParams["title"]
      },
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

    // get categories
    axios.get(
      QUESTION_API_URL + "/category/getCategories",
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {
      const res = response.data.map(item => item.category);
      res.sort();
      res.unshift("None");
      setCategories(res);
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
  }, [navigate, pageNumber, location]);

  // set body background color
  useEffect(()  => {
    document.body.classList.add('questions-bg');

    return () => {
        document.body.classList.remove('questions-bg');
    };
  });

  return (
    <div className="narrow-wrapper">
      {/* Table displaying questions */}
      <QuestionsTable
        questions={questions}
        categories={categories}
        filters={filters}
        handleDelete={handleDelete}
        applyFilter={applyFilter}
        setQuestions={setQuestions}
        addQuestionToDb={addQuestionToDb}
      />

      {/** Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: "10px" }}>
        <Stack spacing={2}>
        <Pagination
          sx={{
            button: {
              color: '#ffffff',
            },
            '& .MuiPaginationItem-ellipsis': {
              color: '#ffffff',
            },
          }}
          count={totalPages}
          page={pageNumber}
          onChange={handlePageChange}
          color="primary"
        />
        </Stack>
      </div>
    </div>
  );
}

export default Questions;

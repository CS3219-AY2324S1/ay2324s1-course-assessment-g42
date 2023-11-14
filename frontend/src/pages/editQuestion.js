import '../App.css';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import { logout } from '../helpers/logout';
import { standardToast } from '../styles/toastStyles';
import { QUESTION_API_URL } from '../config';

import FormCategoriesSelect from '../components/questions/formCategoriesSelect';
import FormComplexitySelect from '../components/questions/formComplexitySelect';

import Cookies from 'js-cookie';

const FormPaper = styled(Paper)(({ theme }) => ({
  width: 600,
  padding: theme.spacing(2),
  ...theme.typography.body2,
}));

function EditQuestion() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [complexity, setComplexity] = useState("Easy");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleDescChange = (event) => {
    setDesc(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault(); // prevent page from refreshing

    // add question (id adding is done in addQuestionToDb)
    const updatedQuestion = {
      id: id,
      title: title,
      description: desc,
      categories: categories,
      complexity: complexity
    }

    // Add the question to the database
    axios.post(
      QUESTION_API_URL + "/question/updateQuestion",
      updatedQuestion,
      { withCredentials: true, credentials: 'include' }
    )
    .then((response) =>  {
      console.log(response.status);
      navigate('/questions');
      toast.success('Question updated successfully', standardToast);
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
  }

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
      if (!loggedInUser) {
        navigate('/login');
        toast.error("Not signed in!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        toast.clearWaitingQueue();

        return;
      } else {
        const user = JSON.parse(loggedInUser);
        if (user.role === "user") {
          navigate('/');
          toast.error("Unauthorised access!", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
          toast.clearWaitingQueue();

          return;
        }
      }

    // get categories
    axios.get(
      QUESTION_API_URL + "/category/getCategories",
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {
      const res = response.data.map(item => item.category);
      res.sort();
      res.unshift("None");
      setCategoryOptions(res);
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
    console.error(error)})

    axios.post(
      QUESTION_API_URL + "/question/getQuestionById",
      { id: id },
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {
      const question = response.data;
      setTitle(question.title);
      setDesc(question.description);
      setCategories(question.categories);
      setComplexity(question.complexity);
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
        navigate('/questions');
        return;
      }
      if (error.response.status === 500) {
        console.log("There was an error loading the question.");
        toast.error("There was an error loading the question.", standardToast);
        return;
      }
      console.error(error)})
  }, [navigate, id]);

  return (
    <div style={{ display: 'flex', margin: '30px', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}>
        <FormPaper variant="elevation">
          <TextField
            required
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            multiline
            variant="standard"
            inputProps={{ maxLength: 50 }}
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            multiline
            variant="standard"
            value={desc}
            onChange={handleDescChange}
          />
          <FormCategoriesSelect
            categories={categories}
            categoryOptions={categoryOptions}
            setCategories={setCategories}
          />
          <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
          <Button type="submit">Save Changes</Button>
        </FormPaper>
      </form>
    </div>
  );
}

export default EditQuestion;

import '../../App.css';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import FormCategoriesSelect from './formCategoriesSelect';
import FormComplexitySelect from './formComplexitySelect';

function FormDialog({ questions, categoryOptions, setQuestions, addQuestionToDb }) {
  const [open, setOpen] = useState(false);
  // below are input references used for the form dialog
  const titleRef = useRef();
  const descRef = useRef();
  const [categories, setCategories] = useState([]);
  const [complexity, setComplexity] = useState("Easy");
  const [isModerator, setIsModerator] = useState(false);

  // handle toggling the form dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddQuestion = (event) => {
    event.preventDefault(); // prevent page from refreshing

    // map titles of categories into a regular array
    const categoriesToAdd = categories;

    // add question (id adding is done in addQuestionToDb)
    const newQuestion = {
      title: titleRef.current.value,
      description: descRef.current.value,
      categories: categoriesToAdd,
      complexity: complexity
    }
    if (addQuestionToDb(newQuestion)) {
      // If question was successfully added, proceed
      setQuestions([...questions, newQuestion]);
      setOpen(false);
    };
  }

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    setIsModerator(false);
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);

        if (user.role !== 'user') {
          setIsModerator(true);                  
        } 
    }
  }, []);

  return (
    <div>
      {/* Button to add a new question, moderator-only */}
      {isModerator &&
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handleClickOpen} style={{ color: '#ffffff' }}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      }

      {/* Form dialog box to submit a question */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { minWidth: '50%' } }}>
      <DialogTitle>Add a new question</DialogTitle>

      <form onSubmit={handleAddQuestion}>
        <DialogContent>
          <DialogContentText>
            Enter the details of your new question here.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="standard"
            inputRef={titleRef}
            inputProps={{ maxLength: 50 }}
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
            inputRef={descRef}
          />
          <FormCategoriesSelect
            categories={categories}
            categoryOptions={categoryOptions}
            setCategories={setCategories}
          />
          <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
        </DialogContent>

        {/* Buttons in the bottom right */}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>

      </Dialog>
    </div>
  );
}

export default FormDialog;

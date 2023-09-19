import '../../App.css';
import React, { useState, useRef } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function FormDialog({ questions, setQuestions, createQuestion }) {
  const [open, setOpen] = useState(false);
  // below are input references used for the form dialog
  const idRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const catRef = useRef();
  const compRef = useRef();

  // handle toggling the form dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddQuestion = () => {
    // dummy question
    const newQuestion = createQuestion(idRef.current.value, titleRef.current.value,
      descRef.current.value, catRef.current.value, compRef.current.value);
    setQuestions([...questions, newQuestion]);
    setOpen(false);
  }

  return (
    <div className="wrapper">
    {/* Button to add a new question */}
    <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
        </Button>
        {/* Form dialog box to submit a question */}
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of your new question here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="id"
            label="ID"
            fullWidth
            variant="standard"
            inputRef={idRef}
          />
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="standard"
            inputRef={titleRef}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            variant="standard"
            inputRef={descRef}
          />
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category"
            fullWidth
            variant="standard"
            inputRef={catRef}
          />
          <TextField
            autoFocus
            margin="dense"
            id="complexity"
            label="Complexity"
            fullWidth
            variant="standard"
            inputRef={compRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddQuestion}>Add</Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}

export default FormDialog;

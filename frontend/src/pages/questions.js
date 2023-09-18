import '../App.css';
import React, { useState, useRef } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState(rows);
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
      <h1>Questions Repository</h1>
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

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">

        {/* Insert table headers */}
        <TableHead>
          <TableRow key="header">
            <TableCell style={{ fontWeight: 'bold' }}>Question Title</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>Category</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>Complexity</TableCell>
          </TableRow>
        </TableHead>

        {/* Insert table body content */}
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/* Add table cells */}
              <TableCell component="th" scope="row">
                {question.title}
              </TableCell>
              <TableCell align="center">{question.category}</TableCell>
              <TableCell align="center">{question.complexity}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
    </div>
  );
}

export default Questions;

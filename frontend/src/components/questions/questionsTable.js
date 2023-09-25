import '../../App.css';
import React, { useState } from 'react';

import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ComplexityChip from './complexityChip';
import QuestionInfo from './questionInfo';

function QuestionsTable({ questions, handleDelete }) {
  const [open, setOpen] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState();

  const handleClickOpen = (questionId) => {
    setOpen(true);
    const target = questions.find(question => question.id === questionId);
    setTargetQuestion(target);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Dialog popup for question information */}
      <QuestionInfo open={open} handleClose={handleClose} question={targetQuestion} handleDelete={handleDelete} />

      {/* Table component below*/}
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">

        {/* Insert table headers */}
        <TableHead>
          <TableRow key="header">
            <TableCell style={{ fontWeight: 'bold' }}>Question Title</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>Categories</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>Complexity</TableCell>
          </TableRow>
        </TableHead>

        {/* Insert table body content */}
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { cursor: 'pointer' }
              }}
              onClick={() => handleClickOpen(question.id)}
            >
              {/* Add table cells */}
              <TableCell component="th" scope="row">
                {question.title}
              </TableCell>
              <TableCell align="center">
                {question.categories.map((category) => (
                  <Chip key={category} label={category}></Chip>
                ))}
              </TableCell>
              <TableCell align="center">
                <ComplexityChip complexity={question.complexity} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
    </div>
  );
}

export default QuestionsTable;

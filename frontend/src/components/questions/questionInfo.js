import '../../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

import ComplexityChip from './complexityChip';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function QuestionInfo({ open, handleClose, question, handleDelete }) {
  const [isModerator, setIsModerator] = useState(false);
  const navigate = useNavigate();

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

  // if there is no selected question, return null
  if (question === undefined) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/editQuestion/${question.id}`);
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        {/* Question title */}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {question.title}
        </DialogTitle>

        {/* Rest of question contents in dialog box */}
        <DialogContent dividers>
          <Typography gutterBottom>
            <b>ID:</b> {question.id}
          </Typography>
          <Typography gutterBottom sx={{ wordBreak: "break-word" }} component={'span'}>
            <b>Category:</b> {question.categories.map((category) => (
              <Chip key={category} label={category}></Chip>
            ))}
          </Typography>
          <br />
          <Typography gutterBottom sx={{ wordBreak: "break-word" }} component={'span'}>
            <b>Complexity:</b> <ComplexityChip complexity={question.complexity} />
          </Typography>
          <Typography gutterBottom sx={{ whiteSpace: "pre-line" }} component="div">
            {question.description}
          </Typography>
        </DialogContent>

        {/* Action buttons in bottom right of the dialog */}
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
          {isModerator &&
          <>
            <Button color="error"
              onClick={() => {
                handleDelete(question.id);
                handleClose();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                handleEdit();
                handleClose();
              }}
            >
              Edit
            </Button>
          </>
          
          }
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default QuestionInfo;

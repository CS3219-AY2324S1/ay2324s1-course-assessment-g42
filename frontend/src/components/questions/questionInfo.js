import '../../App.css';
import React, { useState, useEffect } from 'react';
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

  const renderedParts = renderDescription(question.description);

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
            {renderedParts}
          </Typography>
        </DialogContent>

        {/* Action buttons in bottom right of the dialog */}
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
          {isModerator &&
          <Button color="error"
            onClick={() => {
              handleDelete(question.id);
              handleClose();
            }}
          >
            Delete
          </Button>
          }
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

function renderDescription(text) {
  const description = text.split(/\n\n|\n(?=-)|\n(?=[+|])/);

  const renderedParts = [];
  let bulletList = null;
  let consolasText = ''; // To collect lines starting with + or |

  description.forEach((part, index) => {
    if (part.trim().startsWith('-')) {
      // If it starts with a bullet point indicator, create a new <ul>
      if (!bulletList) {
        bulletList = <ul key={`bullet-${index}`} children={[]} />;
        renderedParts.push(bulletList);
      }

      // Add the bullet point as an <li>
      bulletList.props.children.push(<li key={`bullet-${index}`}>{part.trim().substring(1)}</li>);
    } else if (part.trim().match(/^[+|]/)) {
      // If it starts with + or |, add it to the consolasText
      consolasText += part + '\n';
    } else {
      // If the part doesn't start with '-', '+', or '|', render it as a regular text paragraph
      if (bulletList) {
        // Close the previous <ul> if we were in a bullet point section
        bulletList = null;
      }
      if (consolasText) {
        // If there's consolas text collected, render it together with the white-space: pre CSS property
        renderedParts.push(
          <p
            key={`consolas-${index}`}
            style={{
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre',
            }}
          >
            {consolasText.trim()}
          </p>
        );
        consolasText = ''; // Reset consolasText
      }
      renderedParts.push(<p key={`regular-${index}`}>{part}</p>);
    }
  });

  // Check if there's remaining consolasText to render
  if (consolasText) {
    renderedParts.push(
      <p
        key={`consolas-${description.length}`}
        style={{
          fontFamily: 'Consolas, monospace',
          whiteSpace: 'pre',
        }}
      >
        {consolasText.trim()}
      </p>
    );
  }

  return <div>{renderedParts}</div>;
}

export default QuestionInfo;

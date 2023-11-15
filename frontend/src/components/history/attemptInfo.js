import '../../App.css';
import '../../styles/attemptinfo.css';
import React from 'react';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { Grid } from '@mui/material';
import { DifficultyText, RenderedDescription } from '../../helpers/questionFormatters';
import { Editor } from '@monaco-editor/react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function AttemptInfo({ open, handleClose, question, attempt }) {

  // if there is no selected question, return null
  if (question === undefined) {
    return null;
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px",
            },
          },
        }}
      >
        {/* Question title */}
      <div className="attempt-wrapper">
        <Grid container spacing={2}>
          {/* Left side of page */}
          <Grid item xs={5} style={{height: '85vh'}}>
            <div className="collab-section-header">
              Description
            </div>
            <div className="collab-question-content">
              <b className="question-title">{question.id}. {question.title}</b>
              <br />
              <DifficultyText difficulty={attempt.complexity} />
              <br />
              {question.categories.map((category) => (
                <Chip key={category} label={category} style={{ height: "25px" }}></Chip>
              ))}
              <RenderedDescription text={question.description} />
            </div>
          </Grid>

          {/* Right side of page */}
          <Grid item xs={7} style={{height: '85vh', overflow: 'auto'}}>
            <div className="collab-section-header">
              {attempt.language}
            </div>
            <div className="attempt-content">
              <Editor
                width="100%"
                height="100%"
                defaultLanguage={attempt.language.toLowerCase()}
                value={attempt.attempt}
                options={{readOnly:true}}
              />
            </div>
          </Grid>
        </Grid>
      </div>
      </BootstrapDialog>
    </div>
  );
}

export default AttemptInfo;

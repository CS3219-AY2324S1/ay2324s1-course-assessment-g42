import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import '../../App.css';
import '../../styles/userProfile.css';

// TODO: example questions, to delete after history service is done
const exampleQuestions = [
 { id: 1, title: "Two Sum", attempt: "something", date: "25 Dec 2023", collaborated: "some user" },
 { id: 2, title: "Three Sum", attempt: "some code", date: "29 Dec 2023", collaborated: "pp" }
];

function QuestionHistory() {

  return (
    <div className="history-wrapper">
      <p className="history-title">Question History</p>

      <TableContainer>
        <Table sx={{ minWidth: 400 }} size="small" aria-label="simple table">

          {/* Insert table headers */}
          <TableHead component={Paper} className="history-table-header">
            <TableRow key="header">
              <TableCell style={{ fontWeight: 'bold' }}>
                Title
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Attempt
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Date of Attempt
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Collaborated With
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Insert table body content */}
          <TableBody>
            {exampleQuestions.map((question) => (
              <TableRow
                key={question.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Add table cells */}
                <TableCell component="th" scope="row">
                  {question.title}
                </TableCell>
                <TableCell align="center">
                  {question.attempt}
                </TableCell>
                <TableCell align="center">
                  {question.date}
                </TableCell>
                <TableCell align="center">
                  {question.collaborated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/** Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: "10px" }}>
        <Stack spacing={2}>
          <Pagination
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  background: '#F24E1E',
                  color: '#ffffff',
                },
            },
            }}
            count={1}
            page={1}
          />
        </Stack>
      </div>
    </div>
  )
}

export default QuestionHistory;

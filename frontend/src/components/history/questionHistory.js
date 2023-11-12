import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AttemptInfo from './attemptInfo'
import { HISTORY_API_URL, QUESTION_API_URL } from '../../config';
import Cookies from 'js-cookie';
import '../../App.css';
import '../../styles/userProfile.css';

function QuestionHistory() {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState();
  const [targetAttempt, setTargetAttempt] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const maxNumberOfAttemptPerPage = 5;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = async (id) => {
    setOpen(true);
    const targetAttempt = history.find(attempt => attempt.id === id);
    const targetQuestion = await axios.post(
      QUESTION_API_URL + "/question/getQuestionById",
      { id: targetAttempt.qnId },
      { withCredentials: true, credentials: 'include' }
    )
    .then(response => {
      console.log(response.data)
      return response.data;
    }).catch(error =>
      console.log("error handle click open", error))
    setTargetQuestion(targetQuestion);
    setTargetAttempt(targetAttempt);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    const user = JSON.parse(loggedInUser);
    const username = user.username;

    const getHistory = async () => {
      axios.post(
        HISTORY_API_URL + "/history/getHistory", {username})
      .then(response => {
        const historyList = response.data;
        setHistory(historyList);
        setTotalPages(Math.ceil(historyList.length/maxNumberOfAttemptPerPage))
        console.log("Get history successfully", username, response.data);
      }).catch(error => console.log("Error getting history"));
    }
    if (username) {
      getHistory();
    }
  }, [navigate]);

  return (
    <div>
      <AttemptInfo open={open} handleClose={handleClose} question={targetQuestion} attempt={targetAttempt}/>
      <div className="history-wrapper">
        <p className="history-title">Question History</p>

        <TableContainer>
          <Table sx={{ minWidth: 400 }} size="small" aria-label="simple table">

            {/* Insert table headers */}
            <TableHead className="history-table-header">
              <TableRow key="header">
                <TableCell style={{ fontWeight: 'bold' }}>
                  Question Title
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>
                  Difficulty
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>
                  Language
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
              {history.length === 0 ? (
                <TableRow 
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}>
                  <TableCell colSpan={5} align="center">
                    You don't have any collaboration record.
                  </TableCell>
                </TableRow>
              ) : (
                history.slice(maxNumberOfAttemptPerPage*(page-1), maxNumberOfAttemptPerPage*page - 1).map((question) => ( 
                  <TableRow
                    key={question.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                    className="history-table-row"
                    onClick={() => handleClickOpen(question.id)}
                  >
                    {/* Add table cells */}
                    <TableCell component="th" scope="row">
                      {question.title}
                    </TableCell>
                    <TableCell align="center">{question.difficulty}</TableCell>
                    <TableCell align="center">{question.language}</TableCell>
                    <TableCell align="center">{question.date}</TableCell>
                    <TableCell align="center">{question.collaborated}</TableCell>
                  </TableRow>
                ))
              )}
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
              count={totalPages}
              page={page}
              onChange={handleChangePage}
            />
          </Stack>
        </div>
      </div>
    </div>
  )
}

export default QuestionHistory;

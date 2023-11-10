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
import { HISTORY_API_URL, QUESTION_API_URL } from '../../config';
import Cookies from 'js-cookie';
import '../../App.css';
import '../../styles/userProfile.css';

function QuestionHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    const user = JSON.parse(loggedInUser);
    const username = user.username;

    const getQuestionById = async (id) => {
      axios.post(
        QUESTION_API_URL + "/question/getQuestionById",
        { id: id },
        { withCredentials: true, credentials: 'include' }
      )
      .then(response => {
        console.log(response.data);
        return response.data.title
      })
    }
    const getHistory = async () => {
      axios.post(
        HISTORY_API_URL + "/history/getHistory", {username})
      .then(response => {
        const historyList = response.data;
        historyList.map(attempt => attempt = {...attempt, getQuestionById})
        /*const qnIdList = historyList.map(question => question.qnId)
        console.log(qnIdList);
        const questionList = getQuestionTitles(qnIdList);
        questionList.forEach(historyAttempt => {
          const existingIndex = historyList.findIndex(qn => qn.qnId === historyAttempt.id);
          if (existingIndex !== -1) {
            historyList[existingIndex] = { ...historyList[existingIndex], title: historyAttempt.title };
          } else {
            historyList.push(historyAttempt);
          }  
        })*/
        setHistory(historyList);
        console.log("Get history successfully", username, response.data);
      }).catch(error => console.log("Error getting history"));
    }
    if (username) {
      getHistory();
    }
  }, [navigate]);

  return (
    <div className="history-wrapper">
      <p className="history-title">Question History</p>

      <TableContainer>
        <Table sx={{ minWidth: 400 }} size="small" aria-label="simple table">

          {/* Insert table headers */}
          <TableHead component={Paper} className="history-table-header">
            <TableRow key="header">
              <TableCell style={{ fontWeight: 'bold' }}>
                Question Title
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
            {history.map((question) => (
              <TableRow
                key={question.title}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Add table cells */}
                <TableCell component="th" scope="row">
                  {question.qnId}
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

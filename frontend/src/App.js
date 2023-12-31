import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Match from './pages/match';
import Home from './pages/home';
import Questions from './pages/questions';
import UserProfile from'./pages/UserProfile';
import Login from './pages/login';
import Signup from './pages/signup';
import NavBar from './components/navBar';
import ViewUsers from './pages/viewUsers';
import Collab from './pages/collab';
import EditQuestion from './pages/editQuestion';

function App() {
  return (
    <>
      <ToastContainer limit={1}/>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="questions/:page" element={<Questions />} />
        <Route path="matching" element={<Match />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="userprofile" element={<UserProfile />}/>
        <Route path="viewusers" element={<ViewUsers />}/>
        <Route path="collab/" element={<Collab />}/>
        <Route path="editquestion/:id" element={<EditQuestion />}/>
      </Routes>
    </>
  );
}

export default App;

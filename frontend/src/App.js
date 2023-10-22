import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/home';
import Questions from './pages/questions';
import UserProfile from'./pages/UserProfile';
import Login from './pages/login';
import Signup from './pages/signup';
import NavBar from './components/navBar';
import ViewUsers from './pages/viewUsers';
import Collab from './pages/collab';

function App() {
  return (
    <div>
      <ToastContainer limit={1}/>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="questions/:page" element={<Questions />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="userprofile" element={<UserProfile />}/>
        <Route path="viewusers" element={<ViewUsers />}/>
        <Route path="collab" element={<Collab />}/>
      </Routes>
    </div>
  );
}

export default App;
import Home from './pages/home';
import Questions from './pages/questions';
import UserProfile from'./pages/userprofile';
import Login from './pages/login';
import Signup from './pages/signup';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="userprofile" element={<UserProfile />}/>
      </Routes>
    </div>
  );
}

export default App;
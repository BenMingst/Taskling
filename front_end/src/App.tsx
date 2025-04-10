import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Shop from './pages/Shop';
import Tamago from './pages/Tamago';
import Tasks from './pages/Tasks'; // Ensure this file exists
import Account from './pages/account'; // Ensure this file exists
import NotVerified from './pages/notVerified';
import Verified from './pages/Verified';
import ResetPassword from './pages/ResetPassword';

import './App.css';  // Assuming you want to include App styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>} >
        <Route path="/SignIn" element={<SignIn />} />
        
        {/* Other routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/tamago" element={<Tamago />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/account" element={<Account />} />
        <Route path="/notverified" element={<NotVerified />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

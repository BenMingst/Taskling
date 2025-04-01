import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Shop from './pages/Shop';
import Tamago from './pages/Tamago';
import Tasks from './pages/Tasks'; // Ensure this file exists
import './App.css';  // Assuming you want to include App styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Set default route to SignIn */}
        <Route path="/" element={<SignIn />} />
        
        {/* Other routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/tamago" element={<Tamago />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;

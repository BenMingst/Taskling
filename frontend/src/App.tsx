import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Task from './pages/Tasks';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp/>} />  {/* Default route */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/task" element={<Task />} />
    </Routes>
  );
};

export default App; // Default export here

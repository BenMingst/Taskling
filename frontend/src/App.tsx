import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Tasks from './pages/Tasks';
import Shop from './pages/Shop';
import Tamago from './pages/tamago';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp/>} />  {/* Default route */}
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="SignIn" element={<SignIn />} />
      <Route path="/Tasks" element={<Tasks/>} />
      <Route path="/Shop" element={<Shop/>} />
      <Route path="/tamago" element={<Tamago/>} />
    </Routes>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Loginform';
import AdminPanel from './components/AdminPanel';
import CustomerPanel from './components/CustomerPanel';
import AssessmentResults from './components/AssessmentResult'; // Import the Results component
import Graphpage from './components/Graphpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/customer" element={<CustomerPanel />} />
        <Route path="/assessmentresults" element={<AssessmentResults />} /> {/* Add the Results route */}
        <Route path="/graph" element={<Graphpage />} />
       
      </Routes>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoBoothPage from './pages/PhotoBoothPage';
import PhotoResult from './pages/PhotoResult';

function App() {
  return (
    <Router>
      <div className="w-screen h-screen bg-raisinblack">
        <Routes>
          <Route path="/" element={<PhotoBoothPage />} />
          <Route path="/result" element={<PhotoResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

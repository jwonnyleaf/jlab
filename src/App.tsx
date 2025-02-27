import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import PhotoBoothPage from './pages/PhotoBoothPage';
import PhotoResult from './pages/PhotoResult';
function App() {
  return (
    <Router>
      <div className="w-screen h-screen bg-pink flex">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/photobooth" element={<PhotoBoothPage />} />
            <Route path="/result" element={<PhotoResult />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import PhotoBoothPage from './pages/PhotoBoothPage';
import PhotoResult from './pages/PhotoResult';
import Settings from './pages/Settings';
import { PhotoBoothProvider } from './contexts/PhotoBoothContext';

function App() {
  return (
    <Router>
      <PhotoBoothProvider>
        <div className="w-screen h-screen bg-neutral-dark flex">
          <Sidebar />
          <div className="flex-1 ml-16 p-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/photobooth" element={<PhotoBoothPage />} />
              <Route path="/result" element={<PhotoResult />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </PhotoBoothProvider>
    </Router>
  );
}

export default App;

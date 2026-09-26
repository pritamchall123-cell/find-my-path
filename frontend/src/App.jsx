import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Roadmap from './pages/Roadmap';
import Assistant from './pages/Assistant';
import Assessment from './pages/Assessment';
import Matches from './pages/Matches';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function Home() {
  return <div className="p-8 text-2xl font-bold">FindMyPath - Home</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <Assistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
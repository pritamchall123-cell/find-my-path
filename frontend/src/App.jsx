import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Compare from './pages/Compare';
import Roadmap from './pages/Roadmap';
import Assistant from './pages/Assistant';
import Assessment from './pages/Assessment';
import Matches from './pages/Matches';
import Resume from './pages/Resume';
import Readiness from './pages/Readiness';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import DegreePaths from './pages/DegreePaths';
import Settings from './pages/Settings';
import SavedCareers from './pages/SavedCareers';
import TopProgressBar from './components/TopProgressBar';
import Institutions from './pages/Institutions';
import QualificationGuide from './pages/QualificationGuide';
import CompareInstitutions from './pages/CompareInstitutions';
import Scholarships from './pages/Scholarships';
import Portfolio from './pages/Portfolio';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import PathPilot from './pages/PathPilot';
import CareerDirectory from './pages/CareerDirectory';
import SectorDetail from './pages/SectorDetail';
import StatePortalDirectory from './pages/StatePortalDirectory';
import ScholarshipFinder from './pages/ScholarshipFinder';
import EducationHistory from './pages/EducationHistory';
import JourneyTimeline from './pages/JourneyTimeline';
import Achievements from './pages/Achievements';
import CareerGoals from './pages/CareerGoals';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen flex flex-col">
      <TopProgressBar />
      <Navbar />
      <div className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/degree-paths" element={<DegreePaths />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/directory" element={<CareerDirectory />} />
        <Route path="/directory/:slug" element={<SectorDetail />} />
        <Route path="/compare-institutions" element={<CompareInstitutions />} />
        <Route path="/qualification-guide" element={<QualificationGuide />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/scholarships/states" element={<StatePortalDirectory />} />
        <Route path="/scholarships/finder" element={<ScholarshipFinder />} />
        
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/education-history"
          element={
            <ProtectedRoute>
              <EducationHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <JourneyTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <CareerGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
          path="/pathpilot"
          element={
            <ProtectedRoute>
              <PathPilot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGapAnalyzer />
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
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness"
          element={
            <ProtectedRoute>
              <Readiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-careers"
          element={
            <ProtectedRoute>
              <SavedCareers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
      <Footer/>
    </div>
    </BrowserRouter>
  );
}

export default App;
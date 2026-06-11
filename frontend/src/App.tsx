import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './features/explore/Home';
import { Search } from './features/explore/Search';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Library } from './features/library/Library';
import { PlaylistView } from './features/library/PlaylistView';
import { Settings } from './features/settings/Settings';
import { IntroScreen } from './components/IntroScreen';
import { SocialFeed } from './features/social/SocialFeed';
import { Communities } from './features/social/Communities';
import { MusicRoom } from './features/social/MusicRoom';
import { FocusMode } from './features/modes/FocusMode';
import { PartyMode } from './features/modes/PartyMode';
import { DrivingMode } from './features/modes/DrivingMode';
import { SleepMode } from './features/modes/SleepMode';
import { ModesMenu } from './features/modes/ModesMenu';
import { GlobalAudio } from './components/GlobalAudio';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <Router>
      <GlobalAudio />
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />
          <Route path="/playlist/:id" element={
            <ProtectedRoute>
              <PlaylistView />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/social" element={
            <ProtectedRoute>
              <SocialFeed />
            </ProtectedRoute>
          } />
          <Route path="/communities" element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          } />
          <Route path="/room/:roomId" element={
            <ProtectedRoute>
              <MusicRoom />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/modes" element={
            <ProtectedRoute>
              <ModesMenu />
            </ProtectedRoute>
          } />
        </Route>
        {/* Fullscreen modes outside MainLayout */}
        <Route path="/focus" element={
          <ProtectedRoute>
            <FocusMode />
          </ProtectedRoute>
        } />
        <Route path="/party" element={
          <ProtectedRoute>
            <PartyMode />
          </ProtectedRoute>
        } />
        <Route path="/driving" element={
          <ProtectedRoute>
            <DrivingMode />
          </ProtectedRoute>
        } />
        <Route path="/sleep" element={
          <ProtectedRoute>
            <SleepMode />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

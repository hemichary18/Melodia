import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './features/explore/Home';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Search } from './features/explore/Search';
import { Library } from './features/library/Library';
import { Settings } from './features/settings/Settings';
import { IntroScreen } from './components/IntroScreen';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <Router>
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
          <Route path="/explore" element={<div className="p-8 text-white">Explore Page</div>} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

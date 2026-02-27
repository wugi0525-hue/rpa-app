import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Search, User, Compass, HelpCircle, BookOpen } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from './LanguageContext';
import { translations } from './i18n/translations';
import LanguageSelector from './components/LanguageSelector';

// Pages
import Dashboard from './pages/Dashboard';
import AuditForm from './pages/AuditForm';
import CheatSheet from './pages/CheatSheet';
import Magazine from './pages/Magazine';
import Profile from './pages/Profile';
import Login from './pages/Login';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const getNavClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    navigate('/');
  }, [navigate]);

  if (authLoading) return <LoadingSpinner message={t.dash_loading || 'Loading...'} />;

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="stealth-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ padding: '16px 24px 0 24px', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
          <LanguageSelector />
        </div>
        {/* Route Content */}
        <Routes>
          <Route path="/" element={<Dashboard user={currentUser} />} />
          <Route path="/audit" element={<AuditForm user={currentUser} />} />
          <Route path="/guide" element={<CheatSheet />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/profile" element={<Profile user={currentUser} />} />
        </Routes>

        {/* Persistent Stealth Bottom Navigation */}
        <nav className="bottom-nav">
          <button className={getNavClass('/')} onClick={() => navigate('/')}>
            <Compass size={24} />
            <span>{t.nav_audits}</span>
          </button>
          <button className={getNavClass('/magazine')} onClick={() => navigate('/magazine')}>
            <BookOpen size={24} />
            <span>{t.nav_magazine}</span>
          </button>
          <button className={getNavClass('/guide')} onClick={() => navigate('/guide')}>
            <HelpCircle size={24} />
            <span>{t.nav_guide}</span>
          </button>
          <button className={getNavClass('/audit')} onClick={() => navigate('/audit')}>
            <FileText size={24} />
            <span>{t.nav_record}</span>
          </button>
          <button className={getNavClass('/profile')} onClick={() => navigate('/profile')}>
            <User size={24} />
            <span>{t.nav_profile}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default App;

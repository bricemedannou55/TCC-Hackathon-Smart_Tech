import React, { useState } from 'react';
import HomeScreen   from './src/screens/HomeScreen';
import LoginScreen  from './src/screens/LoginScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen]     = useState('home');
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [language, setLanguage]               = useState('fr');
  const [showLoginAlert, setShowLoginAlert]   = useState(false);

  const navigateTo = (screen) => {
    // Si pas connecté et veut aller à la caméra → page connexion
    if (screen === 'camera' && !isLoggedIn) {
      setShowLoginAlert(true);
      setCurrentScreen('login');
      return;
    }
    setShowLoginAlert(false);
    setCurrentScreen(screen);
  };

  const handleLogin = (lang) => {
    setIsLoggedIn(true);
    if (lang) setLanguage(lang);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('home');
  };

  const handleDiagnosticComplete = (result) => {
    setDiagnosticResult(result);
    setCurrentScreen('result');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          onNavigate={navigateTo}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          language={language}
        />
      );
    case 'login':
      return (
        <LoginScreen
          onNavigate={navigateTo}
          onLogin={handleLogin}
          onLanguageChange={handleLanguageChange}
          language={language}
          showAlert={showLoginAlert}
        />
      );
    case 'camera':
      return (
        <CameraScreen
          onNavigate={navigateTo}
          onDiagnosticComplete={handleDiagnosticComplete}
          language={language}
        />
      );
    case 'result':
      return (
        <ResultScreen
          result={diagnosticResult}
          onNavigate={navigateTo}
          language={language}
        />
      );
    default:
      return (
        <HomeScreen
          onNavigate={navigateTo}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          language={language}
        />
      );
  }
}
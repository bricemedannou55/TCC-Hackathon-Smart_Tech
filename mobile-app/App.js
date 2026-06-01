import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';

export default function App() {
  // Gestion simplifiée de la navigation (home, camera, result)
  const [currentScreen, setCurrentScreen] = useState('home');
  // Stockage des données du diagnostic reçu de l'API
  const [scanResult, setScanResult] = useState(null);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const handleDiagnosticComplete = (result) => {
    setScanResult(result);
    setCurrentScreen('result');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {currentScreen === 'home' && (
        <HomeScreen onNavigate={navigateTo} />
      )}
      
      {currentScreen === 'camera' && (
        <CameraScreen 
          onNavigate={navigateTo} 
          onDiagnosticComplete={handleDiagnosticComplete} 
        />
      )}
      
      {currentScreen === 'result' && (
        <ResultScreen 
          result={scanResult} 
          onNavigate={navigateTo} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container = {
    flex: 1,
    backgroundColor: '#fff',
  },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function CameraScreen({ onNavigate, onDiagnosticComplete }) {
  const [loading, setLoading] = useState(false);

  // Simulation d'une analyse (À remplacer par la vraie requête API plus tard)
  const simulateScan = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      // Exemple de fausse réponse JSON renvoyée par le serveur Python
      const mockApiResponse = {
        maladie: "Mosaïque du Manioc",
        confiance: "94%",
        culture: "Manioc",
        remede: "Arracher et détruire les plants infectés pour éviter la propagation. Pour les prochaines plantations, utilisez impérativement des boutures saines et résistantes fournies par les centres agronomiques certifiés."
      };
      onDiagnosticComplete(mockApiResponse);
    }, 2500); // Simule 2.5 secondes d'attente serveur
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Analyse de la feuille en cours par l'IA...</Text>
          </View>
        ) : (
          <Text style={styles.cameraPlaceholderText}>
            [ Zone d'affichage de la Caméra ]{"\n"}
            Cadrez la feuille malade ici
          </Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate('home')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={simulateScan}
          disabled={loading}
        >
          <View style={styles.innerCaptureButton} />
        </TouchableOpacity>
        
        <View style={{ width: 60 }} /> {/* Équilibreur visuel */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#1C1C1C',
  },
  cameraPlaceholderText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  controlsContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: '#000',
  },
  backButton: {
    width: 70,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
});
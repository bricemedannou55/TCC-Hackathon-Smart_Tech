import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function ResultScreen({ result, onNavigate }) {
  if (!result) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Résultat du Diagnostic</Text>

        {/* Bloc Alerte Maladie */}
        <View style={styles.cardError}>
          <Text style={styles.labelField}>Culture : <Text style={styles.valueField}>{result.culture}</Text></Text>
          <Text style={styles.maladieTitle}>{result.maladie}</Text>
          <Text style={styles.confianceText}>Fiabilité de la détection : {result.confiance}</Text>
        </View>

        {/* Bloc Solution / Conseils */}
        <View style={styles.cardRemede}>
          <Text style={styles.remedeHeader}>🌿 Traitement recommandé :</Text>
          <Text style={styles.remedeText}>{result.remede}</Text>
        </View>
      </ScrollView>

      {/* Bouton de retour fixe en bas */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.returnButton} 
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.returnButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F4',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardError: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#D32F2F',
    marginBottom: 20,
  },
  labelField: {
    fontSize: 14,
    color: '#555',
  },
  valueField: {
    fontWeight: 'bold',
  },
  maladieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C62828',
    marginVertical: 8,
  },
  confianceText: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
  cardRemede: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  remedeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  remedeText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  returnButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
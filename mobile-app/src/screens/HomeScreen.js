import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Togo AgriVision</Text>
        <Text style={styles.subtitle}>Votre assistant agricole intelligent</Text>
      </View>

      <View style={styles.illustrationContainer}>
        {/* Vous pouvez remplacer cela par une belle icône ou image */}
        <View style={styles.placeholderCircle}>
          <Text style={styles.emoji}>🌱</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.instruction}>
          Un problème sur vos feuilles de manioc ou de maïs ?
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onNavigate('camera')}
        >
          <Text style={styles.buttonText}>📸 Scanner ma culture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#F9FBFAF',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32', // Vert agricole
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 60,
  },
  actionContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Ombre Android
    shadowColor: '#000', // Ombre iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView, StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// ⚠️ MODIFIE CETTE IP AVEC CELLE DE TON ORDINATEUR POUR LA DÉMO
const API_IP = "192.168.1.70"; 

export default function CameraScreen({ onNavigate, onDiagnosticComplete, language }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading]           = useState(false);
  const [facing, setFacing]             = useState('back');
  const cameraRef                       = useRef(null);

  // ── Traductions ────────────────────────────────────────────────────────
  const T = {
    fr:     {
      title: 'Scanner la feuille',
      tip: '💡 Place la feuille malade dans le cadre, en plein soleil',
      cancel: '✕  Annuler',
      gallery: '🖼️  Galerie',
      shoot: 'Prendre une photo',
      analyzing: 'Analyse en cours par l\'IA...',
      permTitle: 'Accès à la caméra requis',
      permSub: 'L\'application a besoin de la caméra pour photographier les feuilles malades.',
      permBtn: 'Autoriser la caméra',
      permBack: 'Retour',
      errTitle: 'Erreur',
      errMsg: 'Impossible de prendre la photo. Réessaie.',
    },
    ewe:    {
      title: 'Scan agble',
      tip: '💡 Ðo agble dɔ ŋuti camera me, ʋuʋoƒe me',
      cancel: '✕  Gbɔ',
      gallery: '🖼️  Foto ƒome',
      shoot: 'Tsi foto',
      analyzing: 'AI le ʋɔʋɔ wɔm...',
      permTitle: 'Hiã camera',
      permSub: 'App sia hiã camera be aŋlɔ agble foto.',
      permBtn: 'Ɖe camera to',
      permBack: 'Egbe yi',
      errTitle: 'Vodada',
      errMsg: 'Mate ŋu atsi foto o. Lɔ megbe.',
    },
    kabiye: {
      title: 'Scan tɔngɔ',
      tip: '💡 Sɩ tɔngɔ ɖɔɔ camera taa, hɛɛlɛ taa',
      cancel: '✕  Kɔɔ',
      gallery: '🖼️  Foto tɛ',
      shoot: 'Tɩ foto',
      analyzing: 'AI pɩzɩɣ tɔm...',
      permTitle: 'Camera pɩzɩɣ',
      permSub: 'App kanɩ pɩzɩɣ camera se tɩ foto tɔngɔ.',
      permBtn: 'Yele camera',
      permBack: 'Kɔɔ',
      errTitle: 'Sɔnzɩ',
      errMsg: 'Pɩtɩpɩzɩ tɩ foto. Pɩsɩ nɛ ŋlɩzɩ.',
    },
  };
  const t = T[language] || T.fr;

  // ── Envoi de l'image vers l'API FastAPI ──────────────────────────────────
  const sendImageToAPI = async (imageUri) => {
    setLoading(true);

    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    try {
      const response = await fetch(`http://${API_IP}:8000/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Transmission du dictionnaire JSON global et de la langue courante
        onDiagnosticComplete({
          apiData: data,
          currentLanguage: language
        });
      } else {
        Alert.alert(t.errTitle, "Erreur lors du traitement de l'image par le serveur.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t.errTitle, "Impossible de joindre le serveur de l'IA. Vérifiez l'adresse IP ou le réseau.");
    } finally {
      setLoading(false);
    }
  };

  // ── Prendre photo avec la caméra ──────────────────────────────────────
  const takePicture = async () => {
    if (!cameraRef.current || loading) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      await sendImageToAPI(photo.uri);
    } catch (e) {
      Alert.alert(t.errTitle, t.errMsg);
    }
  };

  // ── Choisir depuis la galerie ─────────────────────────────────────────
  const pickFromGallery = async () => {
    if (loading) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.errTitle, 'Permission galerie refusée.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      await sendImageToAPI(result.assets[0].uri);
    }
  };

  // ── Pas encore de permission ──────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.permCenter}>
        <ActivityIndicator size="large" color="#1a7a40" />
      </View>
    );
  }

  // ── Permission refusée ────────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permCenter}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={styles.permTitle}>{t.permTitle}</Text>
        <Text style={styles.permSub}>{t.permSub}</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>{t.permBtn}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permBack} onPress={() => onNavigate('home')}>
          <Text style={styles.permBackText}>{t.permBack}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.overlay}>

          {/* ── BARRE HAUTE ── */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topBtn} onPress={() => onNavigate('home')} disabled={loading}>
              <Text style={styles.topBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>{t.title}</Text>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
              disabled={loading}
            >
              <Text style={styles.topBtnText}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* ── CADRE DE SCAN ── */}
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#f9a825" />
                <Text style={styles.loadingText}>{t.analyzing}</Text>
              </View>
            )}
          </View>

          {/* ── CONSEIL ── */}
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>{t.tip}</Text>
          </View>

          {/* ── BARRE BAS : Galerie + Déclencheur ── */}
          <View style={styles.bottomBar}>

            {/* Bouton Galerie */}
            <TouchableOpacity
              style={[styles.galleryBtn, loading && styles.btnDisabled]}
              onPress={pickFromGallery}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.galleryIcon}>🖼️</Text>
              <Text style={styles.galleryText}>{t.gallery}</Text>
            </TouchableOpacity>

            {/* Bouton déclencheur (photo immédiate) */}
            <View style={styles.shutterWrap}>
              <TouchableOpacity
                style={[styles.shutterBtn, loading && styles.btnDisabled]}
                onPress={takePicture}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.shutterInner} />
              </TouchableOpacity>
              <Text style={styles.shutterLabel}>{t.shoot}</Text>
            </View>

          </View>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera:    { flex: 1 },

  permCenter: {
    flex: 1, backgroundColor: '#f4f7f3',
    alignItems: 'center', justifyContent: 'center', padding: 30,
  },
  permEmoji: { fontSize: 60, marginBottom: 16 },
  permTitle: { fontSize: 20, fontWeight: '700', color: '#1a4a2a', marginBottom: 10, textAlign: 'center' },
  permSub:   { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permBtn: {
    backgroundColor: '#1a7a40', borderRadius: 12,
    paddingVertical: 14, width: '100%', alignItems: 'center', marginBottom: 12,
  },
  permBtnText:  { color: '#fff', fontSize: 15, fontWeight: '700' },
  permBack:     { paddingVertical: 10 },
  permBackText: { color: '#1a7a40', fontSize: 14 },

  overlay: { flex: 1, justifyContent: 'space-between', backgroundColor: 'transparent' },

  // ── Barre haute ──
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topBtn:     { padding: 8 },
  topBtnText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  topTitle:   { color: '#fff', fontSize: 15, fontWeight: '600' },

  // ── Cadre scan ──
  scanArea: {
    alignSelf: 'center',
    width: 240, height: 240,
    position: 'relative',
    justifyContent: 'center', alignItems: 'center',
  },
  corner: { position: 'absolute', width: 28, height: 28 },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#f9a825', borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#f9a825', borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#f9a825', borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#f9a825', borderBottomRightRadius: 4 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center', justifyContent: 'center', borderRadius: 4,
  },
  loadingText: { color: '#fff', marginTop: 12, fontSize: 13, textAlign: 'center', paddingHorizontal: 10 },

  // ── Conseil ──
  tipBox: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(26,122,64,0.75)',
    borderRadius: 10, padding: 10,
  },
  tipText: { color: '#fff', fontSize: 13, textAlign: 'center', lineHeight: 20 },

  // ── Barre basse ──
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 44,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  // Bouton galerie
  galleryBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 16,
    paddingVertical: 12, paddingHorizontal: 18,
    gap: 6,
  },
  galleryIcon: { fontSize: 26 },
  galleryText: { color: '#fff', fontSize: 11, fontWeight: '500', textAlign: 'center' },

  // Bouton déclencheur
  shutterWrap: { alignItems: 'center', gap: 8 },
  shutterBtn: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#fff',
  },
  shutterLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '500', textAlign: 'center' },

  btnDisabled: { opacity: 0.4 },
});
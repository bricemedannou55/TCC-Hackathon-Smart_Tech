import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  Animated, Dimensions, StatusBar, Modal, SafeAreaView,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { TRANSLATIONS } from './LoginScreen';

const { width: W, height: H } = Dimensions.get('window');
const VIDEO_H = H * 0.45;

const HOME_T = {
  fr:     { tagline: 'Détecte les maladies de tes cultures', cta: 'Scanner ma culture', logout: 'Déconnexion', about: 'À propos', login: 'Connexion' },
  ewe:    { tagline: 'Kpɔ agble dɔlele', cta: 'Scan agble', logout: 'Fía', about: 'Ðe zu', login: 'Ðo ŋkɔ' },
  kabiye: { tagline: 'Nɩɩ tɔngɔ ɖɔɔnaa', cta: 'Scan tɔngɔ', logout: 'Lɩɩ', about: 'Ɛsɩ tɔm', login: 'Sʊʊ' },
};

const ABOUT_T = {
  fr: {
    title: 'Togo AgriVision', version: 'Version 1.0 — Hackathon TCC 2026',
    q1: 'À quoi sert cette application ?',
    a1: 'Togo AgriVision aide les agriculteurs togolais à détecter rapidement les maladies sur leurs cultures (manioc, maïs) en prenant simplement une photo de la feuille malade.',
    q2: 'Comment utiliser ?',
    steps: ['1️⃣  Appuie sur "Scanner ma culture"', '2️⃣  Prends une photo de la feuille malade', '3️⃣  Reçois le diagnostic et le traitement'],
    team: 'Équipe :', t1: 'Frontend : LADZEKPO Espoir & BANDJOUNI Moni', t2: 'IA : MEDANNOU Brice Josué & KASSEGNIN Narcisse', close: 'Fermer',
  },
  ewe: {
    title: 'Togo AgriVision', version: 'Ðeka 1.0 — Hackathon TCC 2026',
    q1: 'Etɔ̃ wɔna app sia?', a1: 'Togo AgriVision djɔgbe Togo agble dɔwɔlawo be woakpɔ agble dɔlele vevie.',
    q2: 'Aleke wɔna?', steps: ['1️⃣  Ðo "Scan agble"', '2️⃣  Tsi foto', '3️⃣  Xɔ diagnostic'],
    team: 'Bɔbɔwo :', t1: 'Frontend : LADZEKPO Espoir & BANDJOUNI Moni', t2: 'IA : MEDANNOU Brice & KASSEGNIN Narcisse', close: 'Gbɔ',
  },
  kabiye: {
    title: 'Togo AgriVision', version: 'Ðeka 1.0 — Hackathon TCC 2026',
    q1: 'Suwe app kanɩ?', a1: 'Togo AgriVision sɩɩ Togo tɔngɔ tʊm-laɖaa se pana tɔngɔ ɖɔɔnaa kpakpasɩm.',
    q2: 'Suwe pʊmʊna?', steps: ['1️⃣  Tɩ "Scan tɔngɔ"', '2️⃣  Tɩ foto', '3️⃣  Pɩzɩ diagnostic'],
    team: 'Ðɛ-tʊnaa :', t1: 'Frontend : LADZEKPO Espoir & BANDJOUNI Moni', t2: 'IA : MEDANNOU Brice & KASSEGNIN Narcisse', close: 'Kpaɣ',
  },
};

export default function HomeScreen({ onNavigate, isLoggedIn, onLogout, language }) {
  const lang     = language || 'fr';
  const t        = HOME_T[lang];
  const ta       = ABOUT_T[lang];
  const [showAbout, setShowAbout] = useState(false);

  const player = useVideoPlayer(require('../../assets/video.mp4'), (p) => {
    p.loop = true; p.muted = true; p.play();
  });

  const fadeAll   = useRef(new Animated.Value(0)).current;
  const fadeVideo = useRef(new Animated.Value(0)).current;
  const fadeBtn   = useRef(new Animated.Value(0)).current;
  const slideBtn  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.timing(fadeAll,   { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeVideo, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeBtn,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideBtn, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d3a1e" />
      <View style={styles.container}>
        <View style={styles.bgGreen} />

        {/* ── LIGNE 1 : Logo centré seul ── */}
        <Animated.View style={[styles.logoLine, { opacity: fadeAll }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
        </Animated.View>

        {/* ── LIGNE 2 : À propos et Connexion ── */}
        <Animated.View style={[styles.navLine, { opacity: fadeAll }]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setShowAbout(true)}>
            <Text style={styles.navBtnText}>{t.about}</Text>
          </TouchableOpacity>
          {isLoggedIn ? (
            <TouchableOpacity style={[styles.navBtn, styles.logoutBtn]} onPress={onLogout}>
              <Text style={styles.logoutBtnText}>{t.logout}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('login')}>
              <Text style={styles.navBtnText}>{t.login}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── TITRE ── */}
        <Animated.View style={[styles.titleBlock, { opacity: fadeAll }]}>
          <Text style={styles.appTitle}>Togo AgriVision</Text>
          <Text style={styles.appSubtitle}>{t.tagline}</Text>
        </Animated.View>

        {/* ── VIDÉO PLEINE LARGEUR avec bords ondulés haut/bas ── */}
        <Animated.View style={[styles.videoWrapper, { opacity: fadeVideo }]}>
          {/* Bord ondulé haut (vert par-dessus la vidéo) */}
          <View style={styles.waveTop} />

          {/* Vidéo pleine largeur */}
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />

          {/* Bord ondulé bas (vert par-dessus la vidéo) */}
          <View style={styles.waveBottom} />

          {/* Badge lecture */}
          <View style={styles.playBadge}>
            <View style={styles.playTriangle} />
            <Text style={styles.playBadgeText}>En cours</Text>
          </View>
        </Animated.View>

        {/* ── BOUTON SCANNER ── */}
        <Animated.View style={[styles.bottomBlock, {
          opacity: fadeBtn, transform: [{ translateY: slideBtn }],
        }]}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => onNavigate('camera')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaIcon}>📷</Text>
            <Text style={styles.ctaText}>{t.cta}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── POPUP À PROPOS ── */}
        <Modal visible={showAbout} transparent animationType="fade" onRequestClose={() => setShowAbout(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconCircle}>
                <Text style={styles.modalIcon}>🌿</Text>
              </View>
              <Text style={styles.modalTitle}>{ta.title}</Text>
              <Text style={styles.modalVersion}>{ta.version}</Text>
              <View style={styles.modalDivider} />
              <Text style={styles.modalBody}>
                <Text style={styles.modalBold}>{ta.q1}{'\n'}</Text>
                {ta.a1}{'\n\n'}
                <Text style={styles.modalBold}>{ta.q2}{'\n'}</Text>
                {ta.steps.join('\n')}{'\n\n'}
                <Text style={styles.modalBold}>{ta.team}{'\n'}</Text>
                {ta.t1}{'\n'}{ta.t2}
              </Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAbout(false)}>
                <Text style={styles.modalCloseBtnText}>{ta.close}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: '#0d3a1e' },
  container: { flex: 1, backgroundColor: '#0d3a1e', alignItems: 'center' },
  bgGreen:   { ...StyleSheet.absoluteFillObject, backgroundColor: '#0d3a1e' },

  // ── Ligne 1 : logo ──
  logoLine: {
    width: '100%', alignItems: 'center',
    paddingTop: 14, paddingBottom: 8,
  },
  logoCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.38)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 20 },

  // ── Ligne 2 : nav ──
  navLine: {
    width: '100%', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 6,
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 10, paddingVertical: 7, paddingHorizontal: 14,
  },
  navBtnText:    { color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: '500' },
  logoutBtn:     { backgroundColor: 'rgba(249,168,37,0.18)', borderColor: 'rgba(249,168,37,0.45)' },
  logoutBtnText: { color: '#f9a825', fontSize: 13, fontWeight: '600' },

  // ── Titre ──
  titleBlock: { alignItems: 'center', paddingVertical: 14 },
  appTitle:   { fontSize: 24, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  appSubtitle:{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 },

  // ── Vidéo pleine largeur ──
  videoWrapper: {
    width: W,
    height: VIDEO_H,
    position: 'relative',
    overflow: 'hidden',
  },
  video: { width: '100%', height: '100%' },

  // Bord ondulé haut : View verte avec borderRadius en bas
  waveTop: {
    position: 'absolute', top: -20, left: -10, right: -10,
    height: 44,
    backgroundColor: '#0d3a1e',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 40,
    zIndex: 2,
  },
  // Bord ondulé bas : View verte avec borderRadius en haut
  waveBottom: {
    position: 'absolute', bottom: -20, left: -10, right: -10,
    height: 44,
    backgroundColor: '#0d3a1e',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 80,
    zIndex: 2,
  },

  playBadge: {
    position: 'absolute', bottom: 28, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10, zIndex: 5,
  },
  playTriangle: {
    width: 0, height: 0,
    borderTopWidth: 5, borderBottomWidth: 5, borderLeftWidth: 8,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
    borderLeftColor: '#f9a825',
  },
  playBadgeText: { color: '#fff', fontSize: 10, fontWeight: '500' },

  // ── Bouton CTA ──
  bottomBlock: {
    flex: 1, width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ctaButton: {
    backgroundColor: '#f9a825', borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    shadowColor: '#f9a825', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  ctaIcon: { fontSize: 22 },
  ctaText: { color: '#3e2000', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  // ── Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center', elevation: 10,
  },
  modalIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#d0eeda', borderWidth: 2, borderColor: '#1a7a40',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  modalIcon:    { fontSize: 26 },
  modalTitle:   { fontSize: 18, fontWeight: '700', color: '#1a4a2a', marginBottom: 2 },
  modalVersion: { fontSize: 11, color: '#aaa', marginBottom: 12 },
  modalDivider: { width: '100%', height: 1, backgroundColor: '#e8f0e8', marginBottom: 14 },
  modalBody:    { fontSize: 13, color: '#444', lineHeight: 20, textAlign: 'left', width: '100%', marginBottom: 20 },
  modalBold:    { fontWeight: '700', color: '#1a4a2a' },
  modalCloseBtn: {
    backgroundColor: '#1a7a40', borderRadius: 12,
    paddingVertical: 12, width: '100%', alignItems: 'center',
  },
  modalCloseBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
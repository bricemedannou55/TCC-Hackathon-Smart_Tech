import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  Animated, KeyboardAvoidingView, Platform, StatusBar,
  ScrollView, ActivityIndicator, SafeAreaView,
} from 'react-native';

// ── Traductions ────────────────────────────────────────────────────────────
export const TRANSLATIONS = {
  fr: {
    flag: '🇫🇷', label: 'Français',
    alertMsg: '⚠️  Connecte-toi d\'abord pour scanner ta culture',
    welcome: 'Bienvenue, agriculteur !',
    sub: 'Connecte-toi pour accéder à l\'application',
    phoneLbl: '📞  Numéro de téléphone',
    passLbl: '🔒  Mot de passe',
    phonePH: 'XX XX XX XX',
    passPH: 'Entrez votre mot de passe',
    loginBtn: 'Se connecter',
    or: 'ou',
    smsBtn: '📲  Code SMS à la place',
    noAccount: 'Pas encore inscrit ? ',
    register: 'Créer un compte',
    errPhone: 'Entrez votre numéro de téléphone',
    errPass: 'Entrez votre mot de passe',
    help: '💡 Tu peux aussi utiliser le code SMS si tu as du mal avec le mot de passe',
    langBtn: 'Langue',
    chooseLang: 'Choisir la langue',
    back: '← Retour',
  },
  ewe: {
    flag: '🇹🇬', label: 'Éwé',
    alertMsg: '⚠️  Ðo ŋkɔ zã gbã be nawɔ scanage',
    welcome: 'Woezon, agble dɔwɔla !',
    sub: 'Ðo ŋkɔ kple ŋkɔsese be nawɔ dɔ',
    phoneLbl: '📞  Telefon nyanya',
    passLbl: '🔒  Ŋkɔsese',
    phonePH: 'XX XX XX XX',
    passPH: 'Ðo wò ŋkɔsese fie',
    loginBtn: 'Ðo ŋkɔ',
    or: 'alo',
    smsBtn: '📲  SMS koodu',
    noAccount: 'Mele ŋkɔ dzidzim o? ',
    register: 'Wɔ ŋkɔ yeye',
    errPhone: 'Ðo wò telefon nyanya',
    errPass: 'Ðo wò ŋkɔsese',
    help: '💡 Ate ŋu aƒle SMS koodu si wòle ŋkɔsese dzi',
    langBtn: 'Gbegbɔgblɔ',
    chooseLang: 'Tia gbegbɔgblɔ',
    back: '← Egbe yi',
  },
  kabiye: {
    flag: '🇹🇬', label: 'Kabiyè',
    alertMsg: '⚠️  Sʊʊ nɛ pʊmʊna tɔngɔ kɔnɔ',
    welcome: 'Talafi, tɔngɔ tʊm-laɖʊ !',
    sub: 'Ŋmɛsɩ hɩɖɛ taa pʊmʊna',
    phoneLbl: '📞  Telefonu nɔmɔrɔ',
    passLbl: '🔒  Ɩsɩ-tʊ',
    phonePH: 'XX XX XX XX',
    passPH: 'Ŋmɛsɩ ɩsɩ-tʊ taa',
    loginBtn: 'Sʊʊ',
    or: 'yaa',
    smsBtn: '📲  SMS kooɖu',
    noAccount: 'Ŋ tɩɩ nɔmɔrɔ tɛ? ',
    register: 'Ŋmɩ hɩɖɛ kɩkpɛ',
    errPhone: 'Ŋmɛsɩ telefonu nɔmɔrɔ',
    errPass: 'Ŋmɛsɩ ɩsɩ-tʊ taa',
    help: '💡 Pʊmʊna SMS kooɖu tɔm taa',
    langBtn: 'Tɔm',
    chooseLang: 'Pɩzɩ tɔm tʊmɩtʊ',
    back: '← Kɔɔ',
  },
};

const LANGUAGES = [
  { key: 'fr',     flag: '🇫🇷', label: 'Français' },
  { key: 'ewe',    flag: '🇹🇬', label: 'Éwé'      },
  { key: 'kabiye', flag: '🇹🇬', label: 'Kabiyè'   },
];

export default function LoginScreen({ onNavigate, onLogin, onLanguageChange, language, showAlert }) {
  const [lang, setLang]               = useState(language || 'fr');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const t = TRANSLATIONS[lang];

  // Animation alerte
  const alertAnim = useRef(new Animated.Value(showAlert ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(alertAnim, {
      toValue: showAlert ? 1 : 0,
      tension: 80, friction: 10,
      useNativeDriver: true,
    }).start();
  }, [showAlert]);

  // Animation menu
  const menuAnim = useRef(new Animated.Value(0)).current;
  const toggleMenu = (open) => {
    setShowLangMenu(open);
    Animated.spring(menuAnim, {
      toValue: open ? 1 : 0,
      tension: 80, friction: 10,
      useNativeDriver: true,
    }).start();
  };

  // Animation carte
  const fadeCard  = useRef(new Animated.Value(0)).current;
  const slideCard = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeCard,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideCard, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const selectLang = (key) => {
    setLang(key);
    onLanguageChange && onLanguageChange(key);
    toggleMenu(false);
  };

  const handleLogin = () => {
    if (!phone.trim())    { setError(t.errPhone); return; }
    if (!password.trim()) { setError(t.errPass);  return; }
    setError('');
    setLoading(true);
    // Simule connexion — à remplacer par vrai appel API
    setTimeout(() => {
      setLoading(false);
      onLogin && onLogin(lang); // passe la langue choisie à App.js
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#f4f7f3" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── BARRE SUPÉRIEURE ── */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
              <Text style={styles.backText}>{t.back}</Text>
            </TouchableOpacity>

            {/* Bouton langue */}
            <View style={{ zIndex: 100 }}>
              <TouchableOpacity
                style={styles.langBtn}
                onPress={() => toggleMenu(!showLangMenu)}
                activeOpacity={0.85}
              >
                <Text style={styles.langFlag}>
                  {LANGUAGES.find(l => l.key === lang)?.flag}
                </Text>
                <Text style={styles.langBtnText}>{t.langBtn}</Text>
                <Text style={styles.langArrow}>{showLangMenu ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* Menu déroulant */}
              {showLangMenu && (
                <Animated.View style={[
                  styles.dropdown,
                  {
                    opacity: menuAnim,
                    transform: [{
                      translateY: menuAnim.interpolate({
                        inputRange: [0, 1], outputRange: [-8, 0],
                      })
                    }],
                  },
                ]}>
                  <Text style={styles.dropdownTitle}>{t.chooseLang}</Text>
                  {LANGUAGES.map((l, i) => (
                    <TouchableOpacity
                      key={l.key}
                      style={[
                        styles.dropdownItem,
                        lang === l.key && styles.dropdownItemActive,
                        i < LANGUAGES.length - 1 && styles.dropdownItemBorder,
                      ]}
                      onPress={() => selectLang(l.key)}
                    >
                      <Text style={styles.dropdownFlag}>{l.flag}</Text>
                      <Text style={[styles.dropdownLabel, lang === l.key && styles.dropdownLabelActive]}>
                        {l.label}
                      </Text>
                      {lang === l.key && <Text style={styles.dropdownCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>
          </View>

          {/* ── ALERTE : connexion requise ── */}
          {showAlert && (
            <Animated.View style={[
              styles.alertBox,
              { opacity: alertAnim, transform: [{ scale: alertAnim }] },
            ]}>
              <Text style={styles.alertText}>{t.alertMsg}</Text>
            </Animated.View>
          )}

          {/* ── AVATAR ── */}
          <View style={styles.avatarBlock}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👨‍🌾</Text>
            </View>
            <Text style={styles.welcomeTitle}>{t.welcome}</Text>
            <Text style={styles.welcomeSub}>{t.sub}</Text>
          </View>

          {/* ── FORMULAIRE ── */}
          <Animated.View style={[styles.card, { opacity: fadeCard, transform: [{ translateY: slideCard }] }]}>

            <Text style={styles.fieldLabel}>{t.phoneLbl}</Text>
            <View style={styles.inputRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>🇹🇬 +228</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.phonePH}
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
                maxLength={8}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Text style={styles.fieldLabel}>{t.passLbl}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={t.passPH}
                placeholderTextColor="#bbb"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>⚠️  {error}</Text> : null}

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.loginBtnText}>✓  {t.loginBtn}</Text>
              }
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t.or}</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.smsBtn} onPress={() => onLogin && onLogin(lang)} activeOpacity={0.85}>
              <Text style={styles.smsBtnText}>{t.smsBtn}</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>{t.noAccount}</Text>
              <TouchableOpacity onPress={() => onNavigate('register')}>
                <Text style={styles.registerLink}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.helpBlock}>
            <Text style={styles.helpText}>{t.help}</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: '#f4f7f3' },
  container: { flex: 1, backgroundColor: '#f4f7f3' },
  scroll:    { padding: 20, paddingBottom: 40 },

  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  backBtn:  { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 14, color: '#1a7a40', fontWeight: '500' },

  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#c5d9c7',
    borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12,
    elevation: 3,
  },
  langFlag:    { fontSize: 16 },
  langBtnText: { fontSize: 13, color: '#1a4a2a', fontWeight: '600' },
  langArrow:   { fontSize: 10, color: '#1a7a40' },

  dropdown: {
    position: 'absolute', top: 44, right: 0,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#c5d9c7',
    width: 170, elevation: 10, zIndex: 200, overflow: 'hidden',
  },
  dropdownTitle: {
    fontSize: 11, fontWeight: '600', color: '#888',
    paddingHorizontal: 14, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f0f4f0',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, paddingHorizontal: 14,
  },
  dropdownItemBorder:  { borderBottomWidth: 1, borderBottomColor: '#f0f4f0' },
  dropdownItemActive:  { backgroundColor: '#eaf5ee' },
  dropdownFlag:        { fontSize: 18 },
  dropdownLabel:       { fontSize: 14, color: '#333', flex: 1 },
  dropdownLabelActive: { color: '#1a7a40', fontWeight: '700' },
  dropdownCheck:       { fontSize: 13, color: '#1a7a40', fontWeight: '700' },

  // Alerte connexion requise
  alertBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1, borderColor: '#f9a825',
    borderRadius: 12, padding: 12,
    marginBottom: 12,
  },
  alertText: { color: '#7a5000', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  avatarBlock:  { alignItems: 'center', marginVertical: 16 },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#d0eeda',
    borderWidth: 2.5, borderColor: '#1a7a40',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, elevation: 5,
  },
  avatarEmoji:  { fontSize: 34 },
  welcomeTitle: { fontSize: 18, fontWeight: '700', color: '#1a4a2a', marginBottom: 4, textAlign: 'center' },
  welcomeSub:   { fontSize: 13, color: '#888', textAlign: 'center', paddingHorizontal: 20 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 22,
    elevation: 5,
  },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#1a4a2a', marginBottom: 6, marginTop: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderWidth: 1, borderColor: '#c5d9c7',
    borderRadius: 10, marginBottom: 14, overflow: 'hidden',
  },
  prefixBox: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 13, paddingHorizontal: 10,
    borderRightWidth: 1, borderRightColor: '#c5d9c7',
  },
  prefixText: { fontSize: 13, color: '#1a4a2a', fontWeight: '600' },
  input:      { flex: 1, paddingVertical: 13, paddingHorizontal: 12, fontSize: 14, color: '#222' },
  eyeBtn:     { paddingHorizontal: 12 },
  eyeIcon:    { fontSize: 16 },
  errorText:  { color: '#e53935', fontSize: 12, marginBottom: 10, marginTop: -6 },

  loginBtn: {
    backgroundColor: '#1a7a40', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
    marginTop: 4, elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.65 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e8e0' },
  dividerText: { fontSize: 12, color: '#aaa' },

  smsBtn: {
    backgroundColor: '#f4f7f3', borderWidth: 1, borderColor: '#c5d9c7',
    borderRadius: 12, paddingVertical: 13, alignItems: 'center',
  },
  smsBtnText: { color: '#1a4a2a', fontSize: 14, fontWeight: '600' },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  registerText: { fontSize: 13, color: '#999' },
  registerLink: { fontSize: 13, color: '#1a7a40', fontWeight: '700' },

  helpBlock: {
    marginTop: 20, backgroundColor: 'rgba(26,122,64,0.08)',
    borderRadius: 10, padding: 12,
  },
  helpText: { fontSize: 12, color: '#3a7a50', textAlign: 'center', lineHeight: 18 },
});
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, StatusBar, Keyboard, Platform
} from 'react-native';

function findAuthToken(raw) {
  // Parse cookie pairs locally; never persist or transmit credential values.
  const normalized = raw
    .replace(/&#x20;/gi, ' ')
    .replace(/&#32;/gi, ' ')
    .replace(/&nbsp;/gi, ' ');
  for (const part of normalized.split(';')) {
    const item = part.trim();
    const eq = item.indexOf('=');
    if (eq < 0) continue;
    const key = item.slice(0, eq).trim().replace(/^["']|["']$/g, '');
    const value = item.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key.toLowerCase() === 'auth_token' && value.length > 0) return value;
  }
  return null;
}

export default function App() {
  const [cookie, setCookie] = useState('');
  const [scanned, setScanned] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const detected = useMemo(() => scanned ? Boolean(findAuthToken(cookie)) : false, [scanned, cookie]);

  function scan() {
    Keyboard.dismiss();
    setScanned(true);
  }

  function clear() {
    setCookie('');
    setScanned(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131D" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <View style={styles.logo}><Text style={styles.logoText}>FD</Text></View>
          <View style={{flex: 1}}>
            <Text style={styles.brand}>FLOATING DESK</Text>
            <Text style={styles.subBrand}>COOKIE CHECKER</Text>
          </View>
          <View style={styles.offline}><View style={styles.dot}/><Text style={styles.offlineText}>OFFLINE</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>PRIVATE · ON-DEVICE TOOL</Text>
          <Text style={styles.title}>Cookie{ '\n' }Inspector</Text>
          <Text style={styles.description}>Paste a cookie string to check whether an auth_token field is present.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>COOKIE STRING</Text>
            <Text style={styles.optional}>PASTE BELOW</Text>
          </View>
          <TextInput
            value={cookie}
            onChangeText={(value) => { setCookie(value); setScanned(false); }}
            placeholder="Paste your complete cookie string here..."
            placeholderTextColor="#737B8F"
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={styles.input}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>Your text stays on this device. It is not uploaded or saved.</Text>
          <Pressable onPress={scan} disabled={!cookie.trim()} style={({pressed}) => [styles.primary, !cookie.trim() && styles.disabled, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>SCAN COOKIE  →</Text>
          </Pressable>
          <Pressable onPress={clear} style={styles.clear}>
            <Text style={styles.clearText}>Clear input</Text>
          </Pressable>
        </View>

        {scanned && (
          <View style={styles.result}>
            <Text style={styles.resultEyebrow}>SCAN RESULT</Text>
            <View style={styles.resultRow}>
              <View>
                <Text style={styles.resultName}>auth_token</Text>
                <Text style={styles.resultCaption}>{detected ? 'Field detected · value protected' : 'No matching field found'}</Text>
              </View>
              <View style={[styles.pill, detected ? styles.found : styles.missing]}>
                <Text style={[styles.pillText, detected ? styles.foundText : styles.missingText]}>{detected ? 'FOUND' : 'NOT FOUND'}</Text>
              </View>
            </View>
            {detected && <Text style={styles.protected}>••••••••••••••••••••  Hidden for account security</Text>}
          </View>
        )}

        <Pressable onPress={() => setShowHelp(!showHelp)} style={styles.helpToggle}>
          <Text style={styles.helpTitle}>How does it work?</Text>
          <Text style={styles.helpPlus}>{showHelp ? '−' : '+'}</Text>
        </Pressable>
        {showHelp && <Text style={styles.helpBody}>The app reads semicolon-separated cookie pairs on your phone and checks the field name. It does not display, copy, store, or send session credential values.</Text>}

        <View style={styles.footer}>
          <Text style={styles.footerText}>FLOATING DESK  •  LOCAL PROCESSING ONLY</Text>
          <Text style={styles.footerSub}>Keep session cookies private. Never share them in screenshots or chats.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#10131D' },
  page: { padding: 22, paddingBottom: 38 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Platform.OS === 'android' ? 12 : 4 },
  logo: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#A78BFA', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#171326', fontSize: 15, fontWeight: '900' },
  brand: { color: '#F4F2FA', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  subBrand: { color: '#8E95A8', fontSize: 9, letterSpacing: 2, marginTop: 3 },
  offline: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#30394A', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#55D6A0' },
  offlineText: { color: '#B8C3D2', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  hero: { marginTop: 42, marginBottom: 24 },
  eyebrow: { color: '#A78BFA', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#F7F5FC', fontSize: 42, lineHeight: 47, fontWeight: '900', marginTop: 12, letterSpacing: -1.5 },
  description: { color: '#A5ACBD', fontSize: 14, lineHeight: 22, marginTop: 12, maxWidth: 310 },
  card: { backgroundColor: '#1A1F2C', borderColor: '#2B3242', borderWidth: 1, borderRadius: 20, padding: 17 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#E7E4EF', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  optional: { color: '#777F93', fontSize: 9, letterSpacing: 1 },
  input: { minHeight: 170, marginTop: 14, borderRadius: 13, borderWidth: 1, borderColor: '#343C4E', backgroundColor: '#121722', color: '#F1EFF7', padding: 13, fontSize: 13, lineHeight: 20 },
  hint: { color: '#7F899D', fontSize: 10, lineHeight: 15, marginTop: 10 },
  primary: { backgroundColor: '#A78BFA', borderRadius: 13, minHeight: 51, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#171326', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  clear: { alignItems: 'center', padding: 12, marginTop: 3 },
  clearText: { color: '#AEB5C5', fontSize: 12, fontWeight: '600' },
  result: { backgroundColor: '#1A1F2C', borderWidth: 1, borderColor: '#343C4E', borderRadius: 18, padding: 17, marginTop: 17 },
  resultEyebrow: { color: '#929BB0', fontSize: 9, letterSpacing: 1.5, fontWeight: '800', marginBottom: 15 },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultName: { color: '#F4F2FA', fontSize: 16, fontWeight: '800' },
  resultCaption: { color: '#9BA4B7', fontSize: 11, marginTop: 5 },
  pill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20 },
  found: { backgroundColor: '#173D34' },
  missing: { backgroundColor: '#3A2A32' },
  pillText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  foundText: { color: '#68D8AD' },
  missingText: { color: '#F19AA5' },
  protected: { color: '#AAB2C2', backgroundColor: '#121722', padding: 12, borderRadius: 10, marginTop: 15, fontSize: 11 },
  helpToggle: { marginTop: 22, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#2B3242', flexDirection: 'row', justifyContent: 'space-between' },
  helpTitle: { color: '#E9E6F1', fontWeight: '700', fontSize: 13 },
  helpPlus: { color: '#A78BFA', fontSize: 20, marginTop: -4 },
  helpBody: { color: '#A5ACBD', fontSize: 12, lineHeight: 20, marginTop: 12 },
  footer: { marginTop: 36, alignItems: 'center' },
  footerText: { color: '#737D91', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, textAlign: 'center' },
  footerSub: { color: '#626C80', fontSize: 10, textAlign: 'center', marginTop: 8, lineHeight: 16 }
});

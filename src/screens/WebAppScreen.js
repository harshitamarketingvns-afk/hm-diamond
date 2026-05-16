import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Linking, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';

const HTML_ASSET = require('../../assets/index.html');

export default function WebAppScreen() {
  const [htmlUri, setHtmlUri] = useState(null);
  const [error, setError]     = useState(false);
  const webRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(HTML_ASSET);
        await asset.downloadAsync();
        setHtmlUri(asset.localUri);
      } catch (e) {
        console.warn('WebApp load error', e);
        setError(true);
      }
    })();
  }, []);

  const handleNavChange = (state) => {
    const { url } = state;
    if (!url) return;
    if (
      url.startsWith('https://wa.me') ||
      url.startsWith('whatsapp://') ||
      url.startsWith('tel:') ||
      url.startsWith('mailto:')
    ) {
      Linking.openURL(url).catch(() => {});
      webRef.current?.stopLoading();
    }
  };

  const handleRequest = (request) => {
    const { url } = request;
    if (
      url.startsWith('https://wa.me') ||
      url.startsWith('whatsapp://') ||
      url.startsWith('tel:') ||
      url.startsWith('mailto:')
    ) {
      Linking.openURL(url).catch(() => {});
      return false;
    }
    return true;
  };

  if (error || (!htmlUri)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0c09" />
      <WebView
        ref={webRef}
        source={{ uri: htmlUri }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onShouldStartLoadWithRequest={handleRequest}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#c9a84c" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#0d0c09' },
  web:    { flex: 1, backgroundColor: '#0d0c09' },
  center: { flex: 1, backgroundColor: '#0d0c09', alignItems: 'center', justifyContent: 'center' },
});

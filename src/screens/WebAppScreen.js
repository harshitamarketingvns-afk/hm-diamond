import React, { useState, useEffect, useRef } from 'react';
import {
  View, ActivityIndicator, StyleSheet, Linking, StatusBar,
  Modal, TouchableOpacity, Text, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { SafeAreaView } from 'react-native-safe-area-context';

const HTML_ASSET = require('../../assets/index.html');
const WA = '918887878193';

export default function WebAppScreen() {
  const [htmlUri, setHtmlUri]   = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoCode, setVideoCode] = useState('');
  const [videoWaMsg, setVideoWaMsg] = useState('');
  const webRef = useRef(null);

  useEffect(() => {
    Asset.fromModule(HTML_ASSET).downloadAsync().then(asset => {
      setHtmlUri(asset.localUri);
    });
  }, []);

  // Handle messages from HTML (openVideo)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'openVideo') {
        setVideoCode(data.code || '');
        setVideoWaMsg(data.waMsg || '');
        setVideoUrl(`https://drive.google.com/file/d/${data.fileId}/preview`);
      }
    } catch (e) {}
  };

  const closeVideo = () => setVideoUrl(null);

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

  if (!htmlUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0c09" />

      {/* Main app WebView */}
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
        onMessage={handleMessage}
        startInLoadingState
        scalesPageToFit={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        bounces={false}
        androidLayerType="hardware"
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#c9a84c" />
          </View>
        )}
      />

      {/* Video Modal — separate full-screen WebView, no black screen */}
      <Modal
        visible={!!videoUrl}
        animationType="slide"
        onRequestClose={closeVideo}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalCode}>{videoCode}</Text>
            <View style={styles.modalActions}>
              {videoWaMsg ? (
                <TouchableOpacity
                  style={styles.waBtn}
                  onPress={() => Linking.openURL(`https://wa.me/${WA}?text=${encodeURIComponent(videoWaMsg)}`)}
                >
                  <Text style={styles.waBtnText}>Enquire</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={styles.closeBtn} onPress={closeVideo}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Drive video WebView — top level, no iframe, no black screen */}
          <WebView
            source={{ uri: videoUrl }}
            style={styles.videoWeb}
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            androidLayerType="hardware"
            allowsProtectedMedia={true}
            scalesPageToFit={false}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#c9a84c" />
              </View>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#0d0c09' },
  web:             { flex: 1, backgroundColor: '#0d0c09' },
  center:          { flex: 1, backgroundColor: '#0d0c09', alignItems: 'center', justifyContent: 'center' },
  modalContainer:  { flex: 1, backgroundColor: '#000' },
  modalHeader:     {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#141208', paddingHorizontal: 16, paddingVertical: 12,
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    borderBottomWidth: 1, borderBottomColor: '#2a2518',
  },
  modalCode:       { color: '#8a6d2a', fontSize: 13, letterSpacing: 2, flex: 1 },
  modalActions:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  waBtn:           {
    backgroundColor: '#25d366', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
  },
  waBtnText:       { color: '#fff', fontSize: 12, fontWeight: '700' },
  closeBtn:        {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1a1810', borderWidth: 1, borderColor: '#2a2518',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText:    { color: '#fff', fontSize: 18, lineHeight: 20 },
  videoWeb:        { flex: 1, backgroundColor: '#000' },
});

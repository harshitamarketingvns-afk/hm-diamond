import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebAppScreen from './src/screens/WebAppScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const onLayout = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#0d0c09' }} onLayout={onLayout}>
        <WebAppScreen />
      </View>
    </SafeAreaProvider>
  );
}

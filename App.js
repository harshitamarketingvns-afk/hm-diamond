import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import { Jost_300Light, Jost_400Regular } from '@expo-google-fonts/jost';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular_Italic,
    Jost_300Light,
    Jost_400Regular,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} onLayout={onLayout}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

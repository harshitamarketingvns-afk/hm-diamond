import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg2,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: {
          fontFamily: 'Jost_400Regular',
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Collection: focused ? 'diamond' : 'diamond-outline',
            About: focused ? 'information-circle' : 'information-circle-outline',
            Contact: focused ? 'call' : 'call-outline',
          };
          return <Ionicons name={icons[route.name]} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Collection" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
}

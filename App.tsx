import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomePage } from './src/components/HomePage';
import { CategoryPage } from './src/components/CategoryPage';
import { StoryPage } from './src/components/StoryPage';
import { SplashPage } from './src/components/SplashPage';
import { CategoryInfo, Story } from './src/types';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Category: { categoryInfo: CategoryInfo };
  Story: { story: Story };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Category" component={CategoryPage} />
          <Stack.Screen name="Story" component={StoryPage} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
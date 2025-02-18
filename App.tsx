import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from './src/components/HomePage';
import { CategoryPage } from './src/components/CategoryPage';
import { StoryPage } from './src/components/StoryPage';
import { CategoryInfo, Story } from './src/types';

export type RootStackParamList = {
  Home: undefined;
  Category: { categoryInfo: CategoryInfo };
  Story: { story: Story };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerAdUnitId="YOUR_AD_UNIT_ID"
        servePersonalizedAds // true or false
        style={{ marginTop: 10 }}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Category" component={CategoryPage} />
          <Stack.Screen name="Story" component={StoryPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

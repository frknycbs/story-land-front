import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomePage } from './src/components/HomePage';
import { CategoryPage } from './src/components/CategoryPage';
import { StoryPage } from './src/components/StoryPage';
import { SplashPage } from './src/components/SplashPage';
import { CategoryInfo, Story } from './src/types';
import mobileAds from 'react-native-google-mobile-ads';
import { TestIds, useAppOpenAd } from 'react-native-google-mobile-ads';

mobileAds()
  .setRequestConfiguration({
    testDeviceIdentifiers: ['939f2c2a-d31d-40ee-9020-24607a3ac8bc'], // Replace with your test device ID
  })
  .then(() => {
    console.log("Test device configured!");
  });


export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Category: { categoryInfo: CategoryInfo };
  Story: { story: Story };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
    const { isLoaded, isClosed, load, show } = useAppOpenAd(TestIds.APP_OPEN, {
            requestNonPersonalizedAdsOnly: true,
        });
    
        useEffect(() => {
            console.log("Loading App Open ad...");
            load(); // Start loading the ad
          
          }, [load]); // Load the ad only once when component mounts
          
          useEffect(() => {
            if (isLoaded) {
              console.log("App open Ad loaded, showing...");
              show(); // Show the ad only when it is fully loaded
            } else {
              console.log("App open Ad not loaded yet...");
            }
          }, [isLoaded]); // Runs whenever `isLoaded` changes
        
        
          useEffect(() => {
            if (isClosed) {
              // Action after the ad is closed
              console.log("App open Ad closed")
            }
          }, [isClosed]);
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
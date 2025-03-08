import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryPage } from './src/components/CategoryPage';
import { StoryPage } from './src/components/StoryPage';
import { SplashPage } from './src/components/SplashPage';
import { BackendResource, Category, CategoryInfo, Story } from './src/types';
import { LandingPage } from './src/components/LandingPage';
import { withIAPContext } from 'react-native-iap';
import { ResourcesProvider } from './src/contexts/StoryContext';

export type RootStackParamList = {
    Splash: undefined;
    Landing: undefined;
    Category: { categoryInfo: CategoryInfo };
    Story: { story: Story}
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {

    /*
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

          */
    return (
        <ResourcesProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>

                    <Stack.Screen
                        name="Splash"
                        component={SplashPage}
                        options={{
                            gestureEnabled: false,
                            headerBackVisible: false
                        }}
                    />
                    <Stack.Screen
                        name="Landing"
                        component={LandingPage}
                        options={{
                            gestureEnabled: true,
                            headerBackVisible: false
                        }}
                    />

                    <Stack.Screen name="Category" component={CategoryPage} />
                    <Stack.Screen name="Story" component={StoryPage} />
                </Stack.Navigator>
            </NavigationContainer>
        </ResourcesProvider>

    );
}

export default withIAPContext(App);
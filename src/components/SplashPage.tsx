import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BackendResource, Category, CategoryInfo, Story } from '../types';
import { useFonts } from 'expo-font';
import { Product, Purchase } from 'react-native-iap';
import { useResources } from '../contexts/ResourceContext';
import { getResources } from '../utils/getResources';
import { useAvailablePurchases } from '../hooks/useAvailablePurchases';
import { checkBackend } from '../api/checkBackend';
import { useProducts } from '../hooks/useProducts';


export const SplashPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [areResourcesLoaded, setAreResourcesLoaded] = useState(false);
    const { stories, setStories, categoryInfo, setCategoryInfo, isBackendOnline, setIsBackendOnline, googlePlayAvailable, setGooglePlayAvailable } = useResources()
    const { waitForAvailablePurchases } = useAvailablePurchases()
    const { waitForProducts } = useProducts()
    
    const [fontsLoaded] = useFonts({
        'BubblegumSans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
    });
  
    // Load resources
    useEffect(() => {
        const loadResources = async () => {
            try {
                
                console.log("Checking backend connection...")
                const backendHealth: boolean | null = await checkBackend()
                setIsBackendOnline(backendHealth)

                console.log("Backend connection: ", backendHealth)

                const availablePurchases: Purchase[] = backendHealth ? await waitForAvailablePurchases() : []
                const products: Product[] = backendHealth ? await waitForProducts() : []

                console.log("Available purchases fetched inside Splash Page: ", availablePurchases)
                console.log("Product list: ", products)

                const resources: BackendResource | null = await getResources(backendHealth, availablePurchases);
                if(!resources)
                    throw("Couldn't fetch resources in Splash Page...")

                if (resources) {
                    setStories(resources.stories)
                    setCategoryInfo(resources.categoryInfo)
                    setAreResourcesLoaded(true)
                }
                    
            } catch (error) {
                console.error('Error loading resources:', error);
            }
        };

        loadResources();
    }, []);


    // Navigate to Landing when both conditions are met
    useEffect(() => {
        console.log("areResourcesLoaded: ", areResourcesLoaded, ", fontsLoaded: ", fontsLoaded, ", googlePlayAvailable: ", googlePlayAvailable)
        if (areResourcesLoaded && fontsLoaded) {
            console.log("Backend resources and fonts loaded")
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'Landing',
                }],
            });
        }
    }, [areResourcesLoaded, navigation, googlePlayAvailable]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" style="light" />
            <ImageBackground
                source={require('../assets/images/spaceBG.jpeg')}
                style={styles.container}
                resizeMode="cover"
            >
                <Image source={require('../assets/images/storyland_logo.png')} style={styles.logo} />
                <Image source={require('../assets/images/storyland_text.png')} style={styles.logoText} />
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200, // Adjust as needed
        height: 200, // Adjust as needed
        resizeMode: 'contain',
    },
    logoText: {
        width: 300, // Adjust as needed
        height: 100, // Adjust as needed
        resizeMode: 'contain',
    },
    appName: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

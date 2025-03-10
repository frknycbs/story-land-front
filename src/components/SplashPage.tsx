import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BackendHealth, BackendResource, Category, CategoryInfo, Story } from '../types';
import { useFonts } from 'expo-font';
import { Product, Purchase } from 'react-native-iap';
import { useResources } from '../contexts/ResourceContext';
import { getResources } from '../utils/getResources';
import {
    getProducts as iapGetProducts,
    getAvailablePurchases as iapGetAvailablePurchases,
} from 'react-native-iap';
import { checkBackend } from '../api/checkBackend';
import { ProgressBar } from './ProgressBar';

export const SplashPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [areResourcesLoaded, setAreResourcesLoaded] = useState(false);
    const { stories, setStories, categoryInfo, setCategoryInfo, isBackendOnline, setIsBackendOnline, googlePlayAvailable, setGooglePlayAvailable } = useResources()

    const [fontsLoaded] = useFonts({
        'BubblegumSans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
    });

    const [numResourcesCached, setNumResourcesCached] = useState<number>(0);
    const [numResourcesTotal, setNumResourcesTotal] = useState<number>(0);
    const [progressBarVisible, setProgressBarVisible] = useState(false);


    useEffect(() => {
       console.log("numResourcesCached: ", numResourcesCached, ", numResourcesTotal: ", numResourcesTotal)
    }, [numResourcesCached, numResourcesTotal]);

    // Load resources
    useEffect(() => {
        const loadResources = async () => {
            try {

                console.log("Checking backend connection...")
                const backendHealth: BackendHealth | null = await checkBackend()
                setIsBackendOnline(backendHealth ? true : false)

                console.log("Backend connection: ", backendHealth)
                let availablePurchases: Purchase[] = []
                let products: Product[] = []

                if (backendHealth) {
                    console.log("Backend UP, getting available purchases and products...")
                    try {
                        availablePurchases = await iapGetAvailablePurchases()
                        products = await iapGetProducts({ skus: backendHealth.categories })
                        setGooglePlayAvailable(true)
                    }

                    catch (err) {
                        console.log("IAP Error: ", err)
                    }
                }

                console.log("Available purchases fetched inside Splash Page: ", availablePurchases)
                console.log("Product list: ", products)

                const resources: BackendResource | null = await getResources(
                    backendHealth ? true : false, availablePurchases, setNumResourcesCached, setNumResourcesTotal, setProgressBarVisible);
                if (!resources)
                    throw ("Couldn't fetch resources in Splash Page...")

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
        console.log("areResourcesLoaded: ", areResourcesLoaded, ", fontsLoaded: ", fontsLoaded, ", googlePlayAvailable: ",
            googlePlayAvailable, ", isBackendOnline: ", isBackendOnline)
        if (areResourcesLoaded && fontsLoaded) {
            console.log("Backend resources and fonts loaded")
            setProgressBarVisible(false)
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'Landing',
                }],
            });
        }
    }, [areResourcesLoaded, navigation, googlePlayAvailable, isBackendOnline]);

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
                {progressBarVisible && <ProgressBar numResourcesCached={numResourcesCached} numTotal={numResourcesTotal} type="splash" />}
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
});

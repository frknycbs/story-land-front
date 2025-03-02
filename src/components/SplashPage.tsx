import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCategoryInfo } from '../api/getCategoryInfo';
import getCachedResource from '../utils/getCachedResource';
import { CategoryInfo } from '../types';
import { useFonts } from 'expo-font';

export const SplashPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const [loadedCategories, setLoadedCategories] = useState<CategoryInfo[]>([]);
    const [fontsLoaded] = useFonts({
        'BubblegumSans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
    });

    // Load resources
    useEffect(() => {
        const loadResources = async () => {
            try {
                // Load categories and images
                const data = await getCategoryInfo();
                if (data) {
                    // Preload images
                    const processedData = [...data];
                    for (const elem of processedData) {
                        elem.bgImageURL = await getCachedResource(elem.bgImageURL);
                    }
                    setLoadedCategories(processedData);
                }
                // Mark resources as loaded
                setResourcesLoaded(true);
            } catch (error) {
                console.error('Error loading resources:', error);
                // Even if there's an error, we'll consider resources "loaded" to prevent getting stuck
                setResourcesLoaded(true);
            }
        };

        loadResources();
    }, []);

    // Ensure minimum display time of 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, 2000); // 2 seconds minimum display time

        return () => clearTimeout(timer);
    }, []);

    // Navigate to Landing when both conditions are met
    useEffect(() => {
        if (resourcesLoaded && minTimeElapsed && fontsLoaded) {
            navigation.reset({
                index: 0,
                routes: [{ 
                    name: 'Landing',
                    params: { categories: loadedCategories }
                }],
            });
        }
    }, [resourcesLoaded, minTimeElapsed, navigation, loadedCategories]);

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

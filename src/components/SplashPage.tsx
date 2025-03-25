import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
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
import { useScreenDimensions } from '../hooks/useDimensions';
import { constants } from '../constants';

export const SplashPage = () => {
    const { screenWidth, screenHeight, isTablet } = useScreenDimensions();

    const musicFiles = {
        main: require("../assets/sounds/main.mp3"),
        loading: require("../assets/sounds/loading.mp3"),
        success: require("../assets/sounds/success.mp3"),
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            width: isTablet ? constants.imageSizeLarge : (Math.min(screenHeight, screenWidth) > 350 ? constants.imageSizeMedium : constants.imageSizeSmall),
            height: isTablet ? constants.imageSizeLarge : (Math.min(screenHeight, screenWidth) > 350 ? constants.imageSizeMedium : constants.imageSizeSmall),
            resizeMode: 'contain',
        },
        logoText: {
            width: isTablet ? 450 : 300, // Adjust as needed
            height: isTablet ? 150 : 100, // Adjust as needed
            resizeMode: 'contain',
        },
    });

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [areResourcesLoaded, setAreResourcesLoaded] = useState(false);
    const { stories, setStories, categoryInfo, setCategoryInfo, isBackendOnline,
        setIsBackendOnline, googlePlayAvailable, setGooglePlayAvailable, bgMusic, setBgMusic, isBgMusicPlaying, setIsBgMusicPlaying } = useResources()



    const [fontsLoaded] = useFonts({
        'BubblegumSans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
    });

    const [numResourcesCached, setNumResourcesCached] = useState<number>(0);
    const [numResourcesTotal, setNumResourcesTotal] = useState<number>(0);
    const [progressBarVisible, setProgressBarVisible] = useState(false);
    const [currentChoice, setCurrentChoice] = useState<"loading" | "main">("loading")
    const [isMainMusicPlaying, setIsMainMusicPlaying] = useState(false);
    const [loadingMusic, setLoadingMusic] = useState<Audio.Sound | null>(null);
    const [stopLoadingMusic, setStopLoadingMusic] = useState(false);
    const [isLoadingMusicStopped, setIsLoadingMusicStopped] = useState(false); 



    useEffect(() => {
        const playLoadingMusic = async () => {
            console.log("Loading music playing")
            const { sound: newSound } = await Audio.Sound.createAsync(musicFiles["loading"], { shouldPlay: true, isLooping: true });
            await newSound.playAsync();
            console.log("Loading music played")
            setLoadingMusic(newSound)
        }

        playLoadingMusic()

    }, [])


    useEffect(() => {
        const handleStopLoadingMusic = async() => {
            if(stopLoadingMusic && loadingMusic) {
                await loadingMusic.stopAsync();
                await loadingMusic.unloadAsync();
                setIsLoadingMusicStopped(true);
            }
        }

        handleStopLoadingMusic()
    }, [stopLoadingMusic, loadingMusic])

    useEffect(() => {
        if(!isLoadingMusicStopped)
            return 
        const playMainMusic = async () => {
            console.log("Inside playMainMusic")
            const { sound: mainSound } = await Audio.Sound.createAsync(musicFiles["main"], { shouldPlay: true, isLooping: true });
           
            await mainSound.playAsync();
            console.log("Main sound played")
            setBgMusic(mainSound)
            setIsBgMusicPlaying(true)

            console.log("Setting isMainMusicPlayed")
            setIsMainMusicPlaying(true)
        }

        playMainMusic()
    }, [isLoadingMusicStopped])

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
                        products = await iapGetProducts({ skus: ["premium"] })
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
                    setStopLoadingMusic(true)
                }



            } catch (error) {
                console.error('Error loading resources:', error);
                setProgressBarVisible(false)
            }
        };

        loadResources();
    }, []);


    // Navigate to Landing when both conditions are met
    useEffect(() => {
        console.log("areResourcesLoaded: ", areResourcesLoaded, ", fontsLoaded: ", fontsLoaded, ", googlePlayAvailable: ",
            googlePlayAvailable, ", isBackendOnline: ", isBackendOnline)
        if (areResourcesLoaded && fontsLoaded && isMainMusicPlaying) {
            console.log("Backend resources and fonts loaded")
            setProgressBarVisible(false)

            navigation.reset({
                index: 0,
                routes: [{
                    name: 'Landing',
                }],
            })


        }
    }, [areResourcesLoaded, navigation, googlePlayAvailable, isBackendOnline, isMainMusicPlaying]);

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



import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from './ads/AdBanner';
import { TestIds, useRewardedAd } from 'react-native-google-mobile-ads';
import { AdNative } from './ads/AdNative';

export const SplashPage = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { isLoaded, isClosed, load, show } = useRewardedAd(TestIds.REWARDED, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        console.log("Loading Rewarded Ad...");
        load(); // Start loading the ad
      
      }, [load]); // Load the ad only once when component mounts
      
      useEffect(() => {
        if (isLoaded) {
          console.log("Rewarded Ad loaded, showing...");
          setTimeout(() => show(), 15000); // Show the ad only when it is fully loaded
        } else {
          console.log("Rewarded Ad not loaded yet...");
        }
      }, [isLoaded]); // Runs whenever `isLoaded` changes
    
    
      useEffect(() => {
        if (isClosed) {
          // Action after the ad is closed
          console.log("Rewarded Ad closed, switching to Category")
          navigation.navigate('Home');
        }
      }, [isClosed, navigation]);


      /*
    useEffect(() => {
        // After 2-3 seconds, hide the splash screen and navigate to Home
        setTimeout(() => {
            navigation.navigate('Home'); // Navigate to Home Screen
        }, 3000); // 3 seconds delay
    }, []); */
    

    return (
        <LinearGradient colors={['#ffc900', '#ff6f00']} style={styles.container}>
            <Image source={require('../assets/images/storyland_logo.png')} style={styles.logo} />
            <Text style={styles.appName}>Storyland</Text>

            <AdBanner />
            <AdNative />
           
        </LinearGradient>
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
    appName: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

export const SplashPage = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        // After 2-3 seconds, hide the splash screen and navigate to Home
        setTimeout(() => {
            navigation.navigate('Home'); // Navigate to Home Screen
        }, 3000); // 3 seconds delay
    }, []);

    return (
        <LinearGradient colors={['#ffc900', '#ff6f00']} style={styles.container}>
            <Image source={require('../assets/images/storyland_logo.png')} style={styles.logo} />
            <Text style={styles.appName}>Storylands</Text>
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

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCategoryInfo } from '../api/getCategoryInfo';
import getCachedResource from '../utils/getCachedResource';
import { BackendResource, CategoryInfo, Story } from '../types';
import { useFonts } from 'expo-font';
import { useIAP } from 'react-native-iap';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getAllResources } from '../api/getAllResources';

/* 
Example Product:
[
    {
        "oneTimePurchaseOfferDetails":  {
            "priceAmountMicros":"10000000",
            "formattedPrice":"TRY 10.00",
            "priceCurrencyCode":"TRY"
        },
        "name": "Test Product", 
        "productType":  "inapp",
        "description":"This is a test product",
        "title":"Test Product (com.j_terry.StoryLandFront (unreviewed))",
        "productId":"test_product",
        "price":"TRY 10.00",
        "localizedPrice":"TRY 10.00",
        "currency":"TRY"
    }
]

*/
export const SplashPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [storeResourcesLoaded, setStoreResourcesLoaded] = useState(false);
    const [resources, setResources] = useState<BackendResource | null>(null);
    const [fontsLoaded] = useFonts({
        'BubblegumSans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
    });

    const {
        connected,
        products,
        availablePurchases,
        initConnectionError,
        getProducts,
        getAvailablePurchases,
    } = useIAP();

    useEffect(() => {
        if (connected) {
            const fetchProductsAndPurchases = async () => {
                try {
                    console.log("Calling getProducts");
                    await getProducts({ skus: ["test_product"] });
                    await getAvailablePurchases();
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };

            fetchProductsAndPurchases();
        }
    }, [connected, getProducts, getAvailablePurchases]); // Run only when `connected` is `true`

    useEffect(() => {
        if (products && products.length > 0) {
            console.log("Test product fetched, marking IAP connected");
            setStoreResourcesLoaded(true);
        }
    }, [products]);

    useEffect(() => {
        if (initConnectionError) {
            console.log("Init connection error:", initConnectionError);
        }
    }, [initConnectionError]);


    // Load resources
    useEffect(() => {
        const loadResources = async () => {
            if (storeResourcesLoaded) {
                try {
                    // Available purchases should be loaded by now
                    const backendResource: BackendResource | null = await getAllResources(availablePurchases);
                    if (backendResource) {
                        console.log("Backend resources loaded")
                        setResources(backendResource)
                    }
                } catch (error) {
                    console.error('Error loading backend resources:', error);
                }
            }

        };

        loadResources();
    }, []);


    // Navigate to Landing when both conditions are met
    useEffect(() => {
        if (resources && storeResourcesLoaded && fontsLoaded) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'Landing',
                    params: { resources }
                }],
            });
        }
    }, [navigation]);

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

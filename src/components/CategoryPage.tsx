import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getStoriesByCategory } from '../api/getStoriesByCategory';
import { Story, CategoryInfo, GooglePlayTransactionReceipt, BackendResource } from '../types';
import { getStyles } from './CategoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';
import { PurchaseModal } from './PurchaseModal';
import { ProductPurchase, Purchase, PurchaseResult, requestPurchase, useIAP } from 'react-native-iap';
import { verifyPurchase } from '../api/verifyPurchase';
import { useResources } from '../contexts/ResourceContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../constants';

type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;

export const CategoryPage = ({ route }: CategoryPageProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [singleCategoryInfo, setSingleCategoryInfo] = useState<CategoryInfo>(route.params.categoryInfo)
    const { stories, setStories, categoryInfo } = useResources();

    const [isPaymentProcessing, setIsPaymentProcessing] = useState<true | false>(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState<"init" | "pending" | "failed" | "success">("init") // Store purchase status

    const { screenWidth, screenHeight, isTablet } = useScreenDimensions();

    const [numResourcesCached, setNumResourcesCached] = useState<number>(0);
    const [numResourcesTotal, setNumResourcesTotal] = useState<number>(0);
    const [progressBarVisible, setProgressBarVisible] = useState(false);

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 5 : 3), [screenWidth, screenHeight]);
    // Calculate item width dynamically
    const itemWidth = screenWidth / numColumns;

    const styles = getStyles(screenWidth, screenHeight, isTablet, itemWidth);

    const generalStyles = getGeneralStyles(screenWidth, screenHeight);

    const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
    const [isThumbnailPressed, setIsThumbnailPressed] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);



    const {
        connected,
        products,
        purchaseHistory,
        availablePurchases,
        currentPurchase,
        currentPurchaseError,
        initConnectionError,
        finishTransaction,
        getProducts,
        getAvailablePurchases,
        getPurchaseHistory,
    } = useIAP();

    const handlePurchase = async (productId: string): Promise<void> => {
        try {
            setPurchaseStatus("pending");
            setTimeout(() => {
                requestPurchase({ skus: ["premium"] }); // No need to return anything
                console.log("Purchase request sent successfully");
            }, 1500)

        } catch (error) {
            console.error('Purchase request failed:', error);
            setPurchaseStatus("failed");
        }
    };

    useEffect(() => {
        if (!currentPurchase) {
            console.log('No new purchase detected');
            return; // No new purchase
        }

        const processPurchase = async () => {
            if (isPaymentProcessing) {
                console.log("Payment already being processed")
                return
            }

            setIsPaymentProcessing(true)
            try {
                console.log('New Purchase Detected:', JSON.stringify(currentPurchase));

                if (!currentPurchase.transactionReceipt) {
                    console.error('No receipt found!');
                    return;
                }

                const transactionReceipt: GooglePlayTransactionReceipt = JSON.parse(currentPurchase.transactionReceipt)
                if (transactionReceipt.purchaseState === 1) {
                    throw ("Purchase cancelled, closing modal...")
                }

                if (transactionReceipt.purchaseState === 2) {
                    console.log("Purchase pending, waiting...")
                    return
                }

                // Purchase state must be 0 -- COMPLETED, Send receipt to backend for verification

                const unlockedStories: Story[] | null = await verifyPurchase(
                    currentPurchase, setNumResourcesCached, setNumResourcesTotal, setProgressBarVisible
                );
                console.log("Backend purchase verification result:", unlockedStories ? true : false);
                if (!unlockedStories) {
                    throw ('Purchase verification failed');
                }

                // ✅ Only finish transaction after successful verification
                try {
                    await finishTransaction({ purchase: currentPurchase, isConsumable: false });
                    console.log('Transaction Finished Successfully');
                }
                catch (err) {
                    console.log("Purchases verified by backend, but failed to finalize transaction", err)
                }

                try {
                    setStories(unlockedStories)

                    let cachedResourcesStr: string | null = await AsyncStorage.getItem("resources")
                    if (!cachedResourcesStr) {
                        cachedResourcesStr = JSON.stringify({ stories: unlockedStories, categoryInfo })
                        await AsyncStorage.setItem("resources", cachedResourcesStr);
                    }

                    else {
                        const cachedResources: BackendResource = JSON.parse(cachedResourcesStr)
                        console.log("Old cachedResource disabled story length:", cachedResources.stories.filter(story => story.disabled).length)
                        cachedResources.stories = unlockedStories
                        console.log("New cachedResource disabled story length:", cachedResources.stories.filter(story => story.disabled).length)
                        await AsyncStorage.setItem("resources", JSON.stringify(cachedResources));
                    }
                }

                catch (err) {
                    console.log("Error regarding cached resources", err)
                }

                // Here, purchase can be considered successful
                setPurchaseStatus("success")

            } catch (error) {
                console.error('Error processing purchase:', error);
                setPurchaseStatus("failed");
            }

            setProgressBarVisible(false)
            setIsPaymentProcessing(false)
        };

        processPurchase();
    }, [currentPurchase]);

    useEffect(() => {
        // ... listen to currentPurchaseError, to check if any error happened
        if (currentPurchaseError) {
            console.error("Purchase error occurred, closing:", currentPurchaseError);
            // console.log(singleCategoryInfo)
            setPurchaseStatus("failed");
        }

    }, [currentPurchaseError]);


    /*
    useEffect(() => {
        const loadStories = async () => {
            const data: Story[] | null = await getStoriesByCategory(categoryInfo.categoryName);
            if (data) {
                for (const story of data)
                    story.thumbnailURL = await getCachedResource(story.thumbnailURL);

                // console.log('Stories loaded:', data);
                setStories([...data, ...data.map(story => ({ ...story, _id: Math.random().toString() })), ...data.map(story => ({ ...story, _id: Math.random().toString() }))]);
            }
        };
        loadStories();
    }, []);
    */

    return (
        <>
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Image
                    source={require('../assets/images/back_arrow.png')}
                    style={styles.backArrowImage}
                />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Image
                    source={require('../assets/images/storyland_logo.png')}
                    style={styles.logoImage}
                />
                <Text style={styles.welcomeText}>
                    Hi there! Pick your friend, and let's start!! 🚀🚀
                </Text>

            </View>


            <ScrollView horizontal={screenHeight > screenWidth}
                contentOffset={screenHeight > screenWidth ? { x: (screenHeight - screenWidth) / 2, y: 0 } : { x: 0, y: (screenWidth - screenHeight) / 2 }}
                showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>

                <ImageBackground
                    source={{ uri: singleCategoryInfo.bgImageURL }}
                    style={styles.imageBackground}
                    resizeMode="cover">
                </ImageBackground>
            </ScrollView>


            <View style={styles.grid} pointerEvents="box-none">
                <FlatList
                    data={stories.filter(story => story.category === singleCategoryInfo.categoryName)}
                    numColumns={numColumns}
                    key={numColumns} // Change key when numColumns changes
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                style={styles.thumbnail}
                                onPress={() => {
                                    if (item.disabled) {
                                        setName(item.name);
                                        setModalVisible(true);
                                    } else {
                                        navigation.navigate('Story', { story: item });
                                    }
                                }}
                            >
                                <Image source={{ uri: item.disabled ? item.disabledThumbnailURL : item.thumbnailURL }}
                                    style={styles.thumbnailImage} />
                                {item.disabled && <View style={styles.overlay}></View>}
                            </TouchableOpacity>
                            <Text style={styles.characterName}>{item.characterName}</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                />

                {/* Purchase Modal */}
                {name && (
                    <PurchaseModal
                        visible={isModalVisible}
                        onClose={() => { setModalVisible(false); setPurchaseStatus('init'); }}
                        name={name}
                        productId={singleCategoryInfo.categoryName}
                        handlePurchase={handlePurchase}
                        purchaseStatus={purchaseStatus}
                        setPurchaseStatus={setPurchaseStatus}
                        numResourcesCached={numResourcesCached}
                        numResourcesTotal={numResourcesTotal}
                        progressBarVisible={progressBarVisible}
                    />
                )}
            </View>
        </>
    );
};

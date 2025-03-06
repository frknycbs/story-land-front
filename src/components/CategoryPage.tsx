import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getStoriesByCategory } from '../api/getStoriesByCategory';
import { Story, CategoryInfo, GooglePlayTransactionReceipt } from '../types';
import { getStyles } from './CategoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';
import { PurchaseModal } from './PurchaseModal';
import { ProductPurchase, Purchase, PurchaseResult, requestPurchase, useIAP } from 'react-native-iap';
import { verifyPurchase } from '../api/verifyPurchase';

type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;

export const CategoryPage = ({ route }: CategoryPageProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const categoryInfo: CategoryInfo  = route.params.categoryInfo;
    const [stories, setStories] = useState<Story[]>(route.params.stories);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Story | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState<"init" | "pending" | "failed" | "success">("init") // Store purchase status

    const { screenWidth, screenHeight } = useScreenDimensions();

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 5 : 3), [screenWidth, screenHeight]);
    // Calculate item width dynamically
    const itemWidth = screenWidth / numColumns;
    const styles = getStyles(screenWidth, screenHeight, itemWidth);

    const generalStyles = getGeneralStyles(screenWidth, screenHeight);

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
            await requestPurchase({ skus: [productId] }); // No need to return anything
            setPurchaseStatus("pending");
            console.log("Purchase request sent successfully");
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
            try {
                console.log('New Purchase Detected:', JSON.stringify(currentPurchase));
    
                if (!currentPurchase.transactionReceipt) {
                    console.error('No receipt found!');
                    return;
                }

                const transactionReceipt: GooglePlayTransactionReceipt = JSON.parse(currentPurchase.transactionReceipt)
                if(transactionReceipt.purchaseState === 1) {
                    throw("Purchase cancelled, closing modal...")
                }

                if(transactionReceipt.purchaseState === 2) {
                    console.log("Purchase pending, waiting...")
                    return
                }
    
                // Purchase state must be 0 -- COMPLETED, Send receipt to backend for verification
                const unlockedStories: Story[] | null = await verifyPurchase(currentPurchase);
                console.log("Backend purchase verification result:", JSON.stringify(unlockedStories));
                if (!unlockedStories) {
                    throw('Purchase verification failed');
                }
    
                // ✅ Only finish transaction after successful verification
                await finishTransaction({ purchase: currentPurchase, isConsumable: false });
                console.log('Transaction Finished Successfully');

                setStories(unlockedStories)
                setPurchaseStatus("success");
            } catch (error) {
                console.error('Error processing purchase:', error);
                setPurchaseStatus("failed");
                return
            }
        };
    
        processPurchase();
    }, [currentPurchase]);

    useEffect(() => {
        // ... listen to currentPurchaseError, to check if any error happened
        if(currentPurchaseError) {
            console.error("Purchase error occurred:", currentPurchaseError);
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
                    navigation.goBack(); // Logic for going back
                }}
            >
                <Image
                    source={require('../assets/images/back_arrow.png')}
                    style={styles.backArrowImage}
                />
            </TouchableOpacity>

            <Image
                source={require('../assets/images/storyland_logo.png')}
                style={generalStyles.logoImage}
            />
            <Text style={styles.welcomeText}>
                Hi there! Pick your friend, and let's start!!
            </Text>

            <ScrollView horizontal={screenHeight > screenWidth}
                contentOffset={screenHeight > screenWidth ? { x: (screenHeight - screenWidth) / 2, y: 0 } : { x: 0, y: (screenWidth - screenHeight) / 2 }}
                showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>

                <ImageBackground
                    source={{ uri: categoryInfo.bgImageURL }}
                    style={styles.imageBackground}
                    resizeMode="cover">
                </ImageBackground>
            </ScrollView>


            <View style={styles.grid} pointerEvents="box-none">
                <FlatList
                    data={stories}
                    numColumns={numColumns}
                    key={numColumns}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                style={styles.thumbnail}
                                onPress={() => {
                                    if (item.name === 'cat') {
                                        setSelectedItem(item);
                                        setModalVisible(true);
                                    } else {
                                        navigation.navigate('Story', { story: item });
                                    }
                                }}
                            >
                                <Image source={{ uri: item.thumbnailURL }} style={styles.thumbnailImage} />
                            </TouchableOpacity>
                            <Text style={styles.characterName}>Budy</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                />

                {/* Purchase Modal */}
                {selectedItem && (
                    <PurchaseModal
                        visible={isModalVisible}
                        onClose={() => {setModalVisible(false); setPurchaseStatus('init');}}
                        item={selectedItem}
                        productId={"test_product"}
                        handlePurchase={handlePurchase}
                        purchaseStatus={purchaseStatus}
                        setPurchaseStatus={setPurchaseStatus}
                    />
                )}
            </View>
        </>
    );
};

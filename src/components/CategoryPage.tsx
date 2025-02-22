import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getStoriesByCategory } from '../api/getStoriesByCategory';
import { Story, CategoryInfo } from '../types';
import { styles } from './CategoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';

type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;

export const CategoryPage = ({ route }: CategoryPageProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { categoryInfo }: { categoryInfo: CategoryInfo } = route.params;
    const [stories, setStories] = useState<Story[]>([]);
    // const [currentStory, setCurrentStory] = useState<Story | null>(null);

    /*
    const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        console.log("Loading Interstitial ad...");
        load(); // Start loading the ad

    }, [load]); // Load the ad only once when component mounts

    useEffect(() => {
        if (isClosed) {
            // Action after the ad is closed
            console.log("Interstitial Ad closed, switching to Story")
            if (currentStory)
                navigation.navigate('Story', { story: currentStory });
        }
    }, [isClosed, navigation]);

    */

    useEffect(() => {
        const loadStories = async () => {
            const data: Story[] | null = await getStoriesByCategory(categoryInfo.categoryName);
            if (data) {
                for (const story of data)
                    story.thumbnailURL = await getCachedResource(story.thumbnailURL);

                // console.log('Stories loaded:', data);
                setStories(data);
            }
        };
        loadStories();
    }, []);

    

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
                    source={require('../assets/images/back_arrow.png')} // Replace with your back arrow image path
                    style={styles.backArrowImage}
                />
            </TouchableOpacity>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={true} // Enable horizontal scrolling
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                maximumZoomScale={3} // Allow pinch-zoom
                minimumZoomScale={1}
            >
                <ImageBackground
                    source={{ uri: categoryInfo.bgImageURL }}
                    style={styles.container}
                    resizeMode="contain" // Ensure the full image is visible
                >

                    <View style={styles.grid}>
                        {stories.map((story: Story) => (
                            <TouchableOpacity
                                key={story._id}
                                style={styles.thumbnail}
                                onPress={() => {

                                    navigation.navigate('Story', { story: story });
                                    /*
                                    if (isLoaded) {
                                        console.log("Interstitial Ad loaded, showing...");
                                        setCurrentStory(story);
                                        show();
                                    }

                                    else {
                                        console.log("Interstitial Ad not loaded yet -- switching to Story");
                                        navigation.navigate('Story', { story: story });
                                    }
                                    */

                                }}
                            >
                                <ImageBackground
                                    source={{ uri: story.thumbnailURL }}
                                    style={styles.thumbnailImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ImageBackground>
            </ScrollView>
        </>
    );
};

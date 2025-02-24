import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, ScrollView, Image } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Story } from '../types';
import { styles } from './StoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { TestIds, useRewardedInterstitialAd } from 'react-native-google-mobile-ads';
import { useNavigation } from '@react-navigation/native';

type StoryPageProps = NativeStackScreenProps<RootStackParamList, 'Story'>;

export const StoryPage = ({ route }: StoryPageProps) => {
    const { story }: { story: Story } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [cachedImageURL, setCachedImageURL] = useState<string>("");
    const [cachedAudioURL, setCachedAudioURL] = useState<string>("");
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    /*
    const { isLoaded, isClosed, load, show } = useRewardedInterstitialAd(TestIds.REWARDED_INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        console.log("Loading Rewarded Interstitial ad...");
        load(); // Start loading the ad

    }, [load]); // Load the ad only once when component mounts

     useEffect(() => {
        if (isClosed) {
            // Action after the ad is closed
            console.log("Rewarded Interstitial Ad closed, continue to story screen")
        }
    }, [isClosed]);

    */
    // Load sound when component mounts
    useEffect(() => {

        return () => {
            // Cleanup function to unload sound when component unmounts
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {
        const loadStoryResources = async () => {
            const image = await getCachedResource(story.imageURL);
            const audio = await getCachedResource(story.audioURL);

            setCachedImageURL(image);
            setCachedAudioURL(audio);

            console.log('Story resources loaded:', { image, audio });
        }

        loadStoryResources();
    }, []);

   

    const handlePlayStoryAudio = async () => {

        /*
        if (!isClosed) {
            isLoaded ? show() : console.log("Ad not loaded yet")
            return
        } */


        if (!sound) {
            // Load the sound if it hasn't been loaded yet
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: cachedAudioURL },
                    { shouldPlay: true },
                );
                setSound(newSound);
                setIsPlaying(true);

                // Handle audio finishing
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status && 'didJustFinish' in status && status.didJustFinish) {
                        setIsPlaying(false);
                    }
                });
            } catch (error) {
                console.error('Error loading sound:', error);
            }
        } else {
            // Toggle play/pause if sound is already loaded
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require('../assets/images/back_arrow.png')}
                    style={styles.backArrowImage}
                />
            </TouchableOpacity>

            {cachedAudioURL !== "" && <TouchableOpacity
                style={styles.playButton}
                onPress={() => handlePlayStoryAudio()}
            >
                <Text style={styles.buttonText}>
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </Text>
            </TouchableOpacity>}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={{ alignItems: 'center' }} // Ensure proper alignment
            >
                <ImageBackground
                    source={{ uri: cachedImageURL }}
                    style={styles.imageBackground}
                    resizeMode="cover"
                />
            </ScrollView>
        </View>
    );
};



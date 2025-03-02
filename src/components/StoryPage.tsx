import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, ScrollView, Image, Animated } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Story } from '../types';
import { getStyles } from './StoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useScreenDimensions } from '../hooks/useDimensions';

type StoryPageProps = NativeStackScreenProps<RootStackParamList, 'Story'>;

export const StoryPage = ({ route }: StoryPageProps) => {
    const { story }: { story: Story } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [cachedImageURL, setCachedImageURL] = useState<string>("");
    const [cachedAudioURL, setCachedAudioURL] = useState<string>("");
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isPlayPauseVisible, setIsPlayPauseVisible] = useState(true);
    const [isSliderVisible, setIsSliderVisible] = useState(true);
    const [isSpeakerVisible, setIsSpeakerVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isScrubbing = useRef(false); // Track if user is scrubbing the slider
    const { screenWidth, screenHeight } = useScreenDimensions();

    const [fadeAnim] = useState(new Animated.Value(1));
    const [fadeAnimSpeaker] = useState(new Animated.Value(0));
    const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

    const styles = getStyles(screenWidth, screenHeight);

    const handleScreenPress = () => {
        if(isPlayPauseVisible) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                console.log("Timeout cleared")
                timeoutRef.current = null; // Reset ref
            }

            fadeout()
        }

        else {
            setIsPlayPauseVisible(true);
            setIsSliderVisible(true);

            if(isPlaying)
                startFadeoutTimer();
        }
    }

    const fadeout = () => {
        // console.log("Inside settimeout");
        Animated.timing(fadeAnim, {
            toValue: 0,   // End opacity value (fully invisible)
            duration: 250, // Duration of the fade-out effect (in milliseconds)
            useNativeDriver: true, // Optimize animation
        }).start(({ finished }) => {
            setIsPlayPauseVisible(false);
            setIsSliderVisible(false);
        });
    }

    const startFadeoutTimer = () => {
        timeoutRef.current = setTimeout(() => fadeout(), 3000);
    };
    
    const cancelFadeoutTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            console.log("Timeout cleared")
            timeoutRef.current = null; // Reset ref
        }
    };

    // Load sound when component mounts
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

   

    useEffect(() => {
        if (isPlaying) {
            console.log("isPlaying", isPlaying);
            setIsSpeakerVisible(true);
            Animated.timing(fadeAnimSpeaker, {
                toValue: 1,   // End opacity value (fully invisible)
                duration: 250, // Duration of the fade-out effect (in milliseconds)
                useNativeDriver: true, // Optimize animation
            }).start();

            startFadeoutTimer();
        }

        else {
            cancelFadeoutTimer();
            Animated.timing(fadeAnimSpeaker, {
                toValue: 0,   // End opacity value (fully invisible)
                duration: 250, // Duration of the fade-out effect (in milliseconds)
                useNativeDriver: true, // Optimize animation
            }).start(({ finished }) => {
                setIsSpeakerVisible(false);
            });
        }
    }, [isPlaying]);


    useEffect(() => {
        if (isPlayPauseVisible) {
            console.log("isPlayPauseVisible", isPlayPauseVisible);
            // Trigger fade-in animation when button becomes visible
            Animated.timing(fadeAnim, {
                toValue: 1,   // End opacity value (fully visible)
                duration: 250, // Duration of the fade-in effect (in milliseconds)
                useNativeDriver: true, // Optimize animation
            }).start();
        }
    }, [isPlayPauseVisible]); // Depend on the visibility of the button

    useEffect(() => {
        const loadStoryResources = async () => {
            const image = await getCachedResource(story.imageURL);
            const audio = await getCachedResource(story.audioURL);
            setCachedImageURL(image);
            setCachedAudioURL(audio);
            console.log('Story resources loaded:', { image, audio });
        };
        loadStoryResources();
    }, []);

    const handlePlayStoryAudio = async () => {
        if (!sound) {
            try {
                const { sound: newSound, status } = await Audio.Sound.createAsync(
                    { uri: cachedAudioURL },
                    { shouldPlay: true, progressUpdateIntervalMillis: 500 }, // Update every 500ms
                );
                setSound(newSound);
                setIsPlaying(true);

                if (!status || !status.isLoaded) {
                    throw new Error("Audio could not be loaded");
                }

                setDuration(status.durationMillis! / 1000); // Duration in seconds

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (!status.isLoaded) return;
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setPosition(0);


                        // Replay the audio from the beginning
                        newSound.setPositionAsync(0);
                        newSound.pauseAsync();
                    } else if (!isScrubbing.current) { // Only update position if not scrubbing
                        setPosition(status.positionMillis / 1000);
                    }
                });
            } catch (error) {
                console.error('Error loading sound:', error);
            }
        } else {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSliderChange = async (value: number) => {
        if (sound) {
            isScrubbing.current = true; // User is scrubbing
            setPosition(value);
            await sound.setPositionAsync(value * 1000); // Convert to milliseconds
            isScrubbing.current = false; // Done scrubbing
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('../assets/images/back_arrow.png')} style={styles.backArrowImage} />
            </TouchableOpacity>

            {isSpeakerVisible && <Animated.View style={[styles.speakerContainer, { opacity: fadeAnimSpeaker }]}>
                <Image source={require('../assets/images/speaker.png')} style={styles.speakerImage} />    
            </Animated.View>}

            {cachedAudioURL !== "" && (
                <>
                    {isPlayPauseVisible &&
                        <Animated.View style={[isPlaying ? styles.pauseButton : styles.playButton, { opacity: fadeAnim }]}>
                            <TouchableOpacity onPress={handlePlayStoryAudio}>
                                <Image source={isPlaying ? require('../assets/images/pause.png') : require('../assets/images/play.png')} 
                                    style={isPlaying ? styles.pauseImage : styles.playImage} />
                            </TouchableOpacity>
                        </Animated.View>}
                </>
            )}

            <ScrollView horizontal={screenHeight > screenWidth}
                contentOffset={screenHeight > screenWidth ? { x: (screenHeight - screenWidth) / 2, y: 0 } : { x: 0, y: (screenWidth - screenHeight) / 2 }}
                showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>
                <TouchableOpacity activeOpacity={1} onPress={() => { handleScreenPress() }}>
                    <ImageBackground source={{ uri: cachedImageURL }} style={styles.imageBackground} resizeMode="cover" />
                </TouchableOpacity>

            </ScrollView>

            {isSliderVisible && <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
                <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onValueChange={(value) => setPosition(value)} // Update position locally
                    onSlidingComplete={handleSliderChange} // Only seek when user releases
                    thumbTintColor="#fff"
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#000"
                />
            </Animated.View>}
        </View>
    );
};
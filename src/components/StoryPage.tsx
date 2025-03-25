import { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, ScrollView, Image, Animated } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Story } from '../types';
import { getStyles } from './StoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useScreenDimensions } from '../hooks/useDimensions';
import { useResources } from '../contexts/ResourceContext';
import { constants } from '../constants';

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

    const { screenWidth, screenHeight, isTablet } = useScreenDimensions();

    const [fadeAnim] = useState(new Animated.Value(1));
    const [fadeAnimSpeaker] = useState(new Animated.Value(0));
    const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

    const styles = getStyles(screenWidth, screenHeight);

    const lastUpdateTime = useRef(0); // Already correct, just confirming
    const [sliderValue, setSliderValue] = useState(0)
    const [isScrubbing, setIsScrubbing] = useState<true | false>(false); // Track if user is scrubbing the slider
    const isScrubbingRef = useRef(false)

    const { isBgMusicPlaying, setIsBgMusicPlaying, bgMusic } = useResources();


    const handleScreenPress = () => {
        if (isPlayPauseVisible) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                // console.log("Timeout cleared")
                timeoutRef.current = null; // Reset ref
            }

            fadeout()
        }

        else {
            setIsPlayPauseVisible(true);
            setIsSliderVisible(true);

            if (isPlaying)
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
            // console.log("Timeout cleared")
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
            // console.log("isPlaying", isPlaying);
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
            // console.log("isPlayPauseVisible", isPlayPauseVisible);
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
                    { shouldPlay: true, progressUpdateIntervalMillis: 100 },
                );
                setSound(newSound);
                setIsPlaying(true);

                if (!status || !status.isLoaded) {
                    throw new Error("Audio could not be loaded");
                }

                setDuration(status.durationMillis! / 1000); // Duration in seconds
                console.log('Audio loaded, duration:', status.durationMillis! / 1000);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (!status.isLoaded) {
                        console.log('Playback status not loaded');
                        return;
                    }

                    if (isScrubbingRef.current) {
                        // console.log('Skipping update due to scrubbing');
                        return;
                    }

                    // console.log("Is scrubbing: ", isScrubbing, "inside onPlayback")
                    const soundSeconds = Math.floor(status.positionMillis / 1000);
                    const lastPosition = lastUpdateTime.current;
                    // console.log("Sound is at: ", soundSeconds, ", lastPosition is at: ", lastPosition)

                    if (soundSeconds > lastPosition) {
                        setPosition(soundSeconds);
                        lastUpdateTime.current = soundSeconds;
                        // console.log('Position updated to:', soundSeconds);
                    }

                    if (status.didJustFinish) {
                        console.log('Audio finished playing');
                        setIsPlaying(false);
                        setPosition(0);
                        newSound.setPositionAsync(0);
                        newSound.pauseAsync();
                        setIsPlayPauseVisible(true)
                        setIsSliderVisible(true)
                        cancelFadeoutTimer();
                        lastUpdateTime.current = 0
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

    const handleSliderComplete = async (value: number) => {
        if (sound) {
            // console.log("Inside handle slider complete, is scrubbing: ", isScrubbing.current, "changing it to false")
            setPosition(value);
            lastUpdateTime.current = Math.floor(value)
            await sound.setPositionAsync(value * 1000); // Convert to milliseconds
            setIsScrubbing(false); // Done scrubbing
            isScrubbingRef.current = false
            startFadeoutTimer()
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
    const [isBgMusicPaused, setIsBgMusicPaused] = useState(false);
    const [isBgMusicResumed, setIsBgMusicResumed] = useState(false);

    useEffect(() => {
        const pauseBgMusic = async () => {
            await bgMusic!.pauseAsync();
            setIsBgMusicPaused(true);
        }

        pauseBgMusic()
    }, [])

    useEffect(() => {
        if (isBackButtonPressed && isBgMusicPaused) {
            const resumeBgMusic = async () => {
                await bgMusic!.playAsync();
                setIsBgMusicResumed(true);
            }

            resumeBgMusic()
        }
    }, [isBackButtonPressed, isBgMusicPaused])


    useEffect(() => {
        if(isBgMusicResumed)
            navigation.goBack()
    }, [isBgMusicResumed])

    /**
     * Handles the press event of the back button in the Story page.
     * When pressed, it logs a message to the console and sets isBackButtonPressed to true.
     * This is used to play the background music when the user navigates back from the Story page.
     */

    const handlePress = () => {
        console.log("Back button pressed in story page")
        setIsBackButtonPressed(true)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => handlePress()}>
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
                <Text style={styles.timeText}>{formatTime(isScrubbing ? sliderValue : position)} / {formatTime(duration)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onValueChange={(value) => {
                        if (isScrubbing) {
                            setSliderValue(value)
                            // setPosition(value)
                        }
                        // console.log("User dragging: ", isScrubbing, "On change, position: ", position); 
                    }}
                    onSlidingComplete={handleSliderComplete}
                    onSlidingStart={() => { setIsScrubbing(true); isScrubbingRef.current = true; cancelFadeoutTimer(); }}
                    thumbTintColor="#fff"
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#000"
                />
            </Animated.View>}
        </View>
    );
};
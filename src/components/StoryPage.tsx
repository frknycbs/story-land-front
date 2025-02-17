import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, Text } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Story } from '../types';
import { styles } from './StoryPage.styles';
import getCachedResource from '../utils/getCachedResource';

type StoryPageProps = NativeStackScreenProps<RootStackParamList, 'Story'>;

export const StoryPage = ({ route }: StoryPageProps) => {
    const { story }: { story: Story } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [cachedImageURL, setCachedImageURL] = useState<string>("");
    const [cachedAudioURL, setCachedAudioURL] = useState<string>("");

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

    const handlePress = async () => {
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
        <ImageBackground
            source={{ uri: cachedImageURL }}
            style={styles.container}
            resizeMode="cover"
        >
            {cachedAudioURL !== "" && <TouchableOpacity
                style={styles.playButton}
                onPress={() => handlePress()}
            >
                <Text style={styles.buttonText}>
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </Text>
            </TouchableOpacity>}
        </ImageBackground>
    );
};

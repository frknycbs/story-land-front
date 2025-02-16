import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, Text } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Story } from '../types';
import { styles } from './StoryPage.styles';

type StoryPageProps = NativeStackScreenProps<RootStackParamList, 'Story'>;

export const StoryPage = ({ route }: StoryPageProps) => {
  const { story }: { story: Story } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Load sound when component mounts
  useEffect(() => {
    return () => {
      // Cleanup function to unload sound when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePress = async () => {
    if (!sound) {
      // Load the sound if it hasn't been loaded yet
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: story.audioURL },
          { shouldPlay: true }
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
      source={{ uri: story.imageURL }}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handlePress()}
      >
        <Text style={styles.buttonText}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

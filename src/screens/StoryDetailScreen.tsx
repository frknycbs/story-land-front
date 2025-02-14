import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../themes/colors';
import { stories } from '../utils/stories';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StoryDetail'>;
  route: RouteProp<RootStackParamList, 'StoryDetail'>;
};

export const StoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { storyId } = route.params;
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const story = stories.find(s => s.id === storyId);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text>Masal bulunamadı</Text>
      </View>
    );
  }

  async function playSound() {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Şimdilik ses dosyası yüklemeyi devre dışı bırakalım
        console.log('Ses dosyası:', story.audioFile);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{story.title}</Text>
        <TouchableOpacity onPress={playSound} style={styles.soundButton}>
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.storyContainer}>
          <Text style={styles.storyText}>{story.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backButton: {
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginRight: 42, // To center the title (balancing with back button)
  },
  soundButton: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
  },
  storyContainer: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
  },
});

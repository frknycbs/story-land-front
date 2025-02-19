import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
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
  const [ currentStory, setCurrentStory ] = useState<Story | null>(null);

  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
});

  useEffect(() => {
    const loadStories = async () => {
      const data: Story[] | null = await getStoriesByCategory(categoryInfo.categoryName);
      if (data) {
        for(const story of data) 
            story.thumbnailURL = await getCachedResource(story.thumbnailURL);
        
        // console.log('Stories loaded:', data);
        setStories(data);
      }
    };
    loadStories();
  }, []);

  useEffect(() => {
    console.log("Loading Interstitial ad...");
    load(); // Start loading the ad
  
  }, [load]); // Load the ad only once when component mounts

  useEffect(() => {
    if (isClosed) {
      // Action after the ad is closed
      console.log("Interstitial Ad closed, switching to Story")
      if(currentStory)
        navigation.navigate('Story', { story: currentStory });
    }
  }, [isClosed, navigation]);

  return (
    <ImageBackground
      source={{ uri: categoryInfo.bgImageURL }}
      style={styles.container}
    >
      <View style={styles.grid}>
        {stories.map((story: Story) => (
          <TouchableOpacity
            key={story._id}
            style={styles.thumbnail}
            onPress={() => {
                if (isLoaded) {
                    console.log("Interstitial Ad loaded, showing...");
                    setCurrentStory(story);
                    show(); // Show the ad only when it is fully loaded
                } else {
                    console.log("Interstitial Ad not loaded yet...");
                }
            }}
          >
            <ImageBackground
              source={{ uri: story.thumbnailURL }}
              style={styles.thumbnailImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

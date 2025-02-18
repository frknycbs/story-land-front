import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getStoriesByCategory } from '../api/getStoriesByCategory';
import { Story, CategoryInfo } from '../types';
import { styles } from './CategoryPage.styles';
import getCachedResource from '../utils/getCachedResource';

type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;

export const CategoryPage = ({ route }: CategoryPageProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { categoryInfo }: { categoryInfo: CategoryInfo } = route.params;
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const data: Story[] | null = await getStoriesByCategory(categoryInfo.categoryName);
      if (data) {
        for(const story of data) 
            story.thumbnailURL = await getCachedResource(story.thumbnailURL);
        
        console.log('Stories loaded:', data);
        setStories(data);
      }
    };
    loadStories();
  }, []);

  return (
    <ImageBackground
      source={{ uri: categoryInfo.bgImageURL }}
      style={styles.container}
    >
      <View style={styles.grid}>
        {stories.slice(0,stories.length).map((story) => (
          <TouchableOpacity
            key={story._id}
            style={styles.thumbnail}
            onPress={() => navigation.navigate('Story', { story })}
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

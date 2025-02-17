import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { CategoryInfo } from '../types';
import { styles } from './HomePage.styles';
import getCachedResource from '../utils/getCachedResource';

export const HomePage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data: Array<CategoryInfo> | null = await getCategoryInfo();
      if (data) {
        for(const elem of data)
            elem.bgImageURL = await getCachedResource(elem.bgImageURL);
        
        console.log('Categories loaded:', data);
        setCategories(data);
        
      }
    };
    loadCategories();
  }, []);

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.categoryName}
            style={styles.categoryButton}
            onPress={() => {
              console.log('Category pressed:', category.categoryName);
              navigation.navigate('Category', { categoryInfo: category });
            }}
          >
            <ImageBackground
              source={{ uri: category.bgImageURL }}
              style={styles.categoryImage}
              resizeMode="cover"
            >
              <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

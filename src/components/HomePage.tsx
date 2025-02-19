import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { CategoryInfo } from '../types';
import { styles } from './HomePage.styles';
import getCachedResource from '../utils/getCachedResource';
import { AdBanner } from './ads/AdBanner';
import { TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';

export const HomePage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [currentCategoryInfo, setCurrentCategoryInfo] = useState<CategoryInfo | null>(null);
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      const data: Array<CategoryInfo> | null = await getCategoryInfo();
      if (data) {
        for(const elem of data)
            elem.bgImageURL = await getCachedResource(elem.bgImageURL);
        
        // console.log('Categories loaded:', data);
        setCategories(data);
        
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    console.log("Loading Interstitial ad...");
    load(); // Start loading the ad
  
  }, [load]); // Load the ad only once when component mounts

  useEffect(() => {
    if (isClosed) {
      // Action after the ad is closed
      console.log("Interstitial Ad closed, switching to Category")
      if(currentCategoryInfo)
        navigation.navigate('Category', { categoryInfo: currentCategoryInfo });
    }
  }, [isClosed, navigation]);

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category: CategoryInfo) => (
          <TouchableOpacity
            key={category.categoryName}
            style={styles.categoryButton}
            onPress={() => {
                console.log('Category pressed:', category.categoryName);
                if (isLoaded) {
                    console.log("Interstitial Ad loaded, showing...");
                    setCurrentCategoryInfo(category)
                    show(); // Show the ad only when it is fully loaded
                } else {
                    console.log("Interstitial Ad not loaded yet...");
                }
                // navigation.navigate('Category', { categoryInfo: category });
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
      <AdBanner />
      <AdBanner />
      <AdBanner />
    
    </SafeAreaView>
  );
};

import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Text, SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { CategoryInfo } from '../types';
import getCachedResource from '../utils/getCachedResource';
import { AdBanner } from './ads/AdBanner';
import { TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import { styles } from './LandingPage.styles';

export const LandingPage = () => {
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
        setCategories(data);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    load(); 
  }, [load]); 

  useEffect(() => {
    if (isClosed && currentCategoryInfo) {
      navigation.navigate('Category', { categoryInfo: currentCategoryInfo });
    }
  }, [isClosed, navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#ffc900', '#ff6f00']} style={styles.container}>
        {/* Kitten Image */}
        <Image source={require('../assets/images/kitty.png')} style={styles.kittenImage} />
        <Text style={styles.welcomeText}>Hi! What kind of story do you like? </Text>

        
        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((category: CategoryInfo) => (
            <TouchableOpacity
            key={category.categoryName}
            style={styles.categoryButton}
            onPress={() => {
              console.log('Category pressed:', category.categoryName);
              if (isLoaded) {
                console.log("Interstitial Ad loaded, showing...");
                setCurrentCategoryInfo(category);
                show();
              } else {
                console.log("Interstitial Ad not loaded yet -- navigating directly to CategoryPage");
                navigation.navigate('Category', { categoryInfo: category });
              }
            }}
          >
            <View style={styles.categoryImageWrapper}> 
              <ImageBackground
                source={{ uri: category.bgImageURL }}
                style={styles.categoryImage}
                resizeMode="cover"
              >
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryName}>{category.categoryName}</Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          
          ))}
        </View>
        
        {/* Ads */}
        <AdBanner />
      </LinearGradient>
    </SafeAreaView>
  );
};
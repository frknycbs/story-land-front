import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { CategoryInfo } from '../types';
import getCachedResource from '../utils/getCachedResource';
import { styles } from './LandingPage.styles';

export const LandingPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Landing'>>();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    // Check if categories were passed from SplashPage
    if (route.params?.categories && route.params.categories.length > 0) {
      console.log('Using categories passed from SplashPage');
      setCategories(route.params.categories);
    } else {
      // Fallback to loading categories if not passed (should not happen in normal flow)
      console.log('No categories passed from SplashPage, loading them now');
      const loadCategories = async () => {
        const data: Array<CategoryInfo> | null = await getCategoryInfo();
        if (data) {
          for(const elem of data)
              elem.bgImageURL = await getCachedResource(elem.bgImageURL);
          setCategories(data);
        }
      };
      loadCategories();
    }
  }, [route.params?.categories]);

  // Get first 4 categories or fill with empty placeholders if less than 4
  const displayCategories = categories.slice(0, 4);
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" style="light" />  
      <ImageBackground 
        source={require('../assets/images/spaceBG.jpeg')} 
        style={styles.container}
        resizeMode="cover"
      >
        {/* Logo Image */}
        <Image source={require('../assets/images/storyland_logo.png')} style={styles.kittenImage} />
        
        {/* Categories Grid */}
        <View style={styles.grid}>
          {/* First Row */}
          <View style={styles.categoryRow}>
            {displayCategories.slice(0, 2).map((category: CategoryInfo) => (
              <TouchableOpacity
                key={category.categoryName}
                style={styles.categoryButton}
                onPress={() => {
                  console.log('Category pressed:', category.categoryName);
                  navigation.navigate('Category', { categoryInfo: category });
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
          
          {/* Second Row */}
          <View style={styles.categoryRow}>
            {displayCategories.slice(2, 4).map((category: CategoryInfo) => (
              <TouchableOpacity
                key={category.categoryName}
                style={styles.categoryButton}
                onPress={() => {
                  console.log('Category pressed:', category.categoryName);
                  navigation.navigate('Category', { categoryInfo: category });
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

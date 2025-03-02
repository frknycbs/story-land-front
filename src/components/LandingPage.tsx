import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Text, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { CategoryInfo } from '../types';
import getCachedResource from '../utils/getCachedResource';
import { getStyles } from './LandingPage.styles';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';

export const LandingPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Landing'>>();
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const { screenWidth, screenHeight } = useScreenDimensions();

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 3 : 2), [screenWidth, screenHeight]);

    // Calculate item width dynamically
    const itemWidth = screenWidth / numColumns;
    const generalStyles = getGeneralStyles(screenWidth, screenHeight);

    const styles = getStyles(screenWidth, screenHeight, itemWidth);

    useEffect(() => {
        // Check if categories were passed from SplashPage
        if (route.params?.categories && route.params.categories.length > 0) {
            const data = route.params.categories;
            console.log('Using categories passed from SplashPage');
            setCategories([...data.map(item => ({ ...item, _id: Math.random().toString() })),
            ...data.map(item => ({ ...item, _id: Math.random().toString() })),
            ...data.map(item => ({ ...item, _id: Math.random().toString() })),]);
        } else {
            // Fallback to loading categories if not passed (should not happen in normal flow)
            console.log('No categories passed from SplashPage, loading them now');
            const loadCategories = async () => {
                const data: Array<CategoryInfo> | null = await getCategoryInfo();
                if (data) {
                    for (const elem of data)
                        elem.bgImageURL = await getCachedResource(elem.bgImageURL);

                    setCategories([...data.map(item => ({ ...item, _id: Math.random().toString() })),
                    ...data.map(item => ({ ...item, _id: Math.random().toString() }))]);
                }


            };
            loadCategories();
            console.log("Categories loaded");
        }
    }, [route.params?.categories]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" style="light" />
            <ImageBackground
                source={require('../assets/images/spaceBG.jpeg')}
                style={styles.container}
                resizeMode="cover"
            >
                {/* Logo Image */}
                <Image source={require('../assets/images/storyland_logo.png')} style={styles.logoImage} />

                {/* Fixed Grid */}
                <View style={styles.gridWrapper}>
                    <FlatList
                        data={categories}
                        numColumns={numColumns}
                        key={numColumns}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.thumbnail}
                                onPress={() => navigation.navigate('Category', { categoryInfo: item })}
                            >
                                <ImageBackground
                                    source={{ uri: item.bgImageURL }}
                                    style={styles.categoryImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.categoryName}>{item.categoryName}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.listContainer}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

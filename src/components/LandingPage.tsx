import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Text, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { BackendResource, CategoryInfo } from '../types';
import getCachedResource from '../utils/getCachedResource';
import { getStyles } from './LandingPage.styles';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';

export const LandingPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Landing'>>();
    const resources: BackendResource = route.params.resources
    const { screenWidth, screenHeight } = useScreenDimensions();

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 3 : 2), [screenWidth, screenHeight]);

    // Calculate item width dynamically
    const itemWidth = screenWidth / numColumns;
    const generalStyles = getGeneralStyles(screenWidth, screenHeight);

    const styles = getStyles(screenWidth, screenHeight, itemWidth);

    /*
    useEffect(() => {
        // Check if categories were passed from SplashPage
        if (resources.categoryInfo && resources.categoryInfo.length > 0) {
            console.log('Using resources passed from SplashPage');
            const data = resources.categoryInfo;
            
            setCategories([...data.map(item => ({ ...item, _id: Math.random().toString() })),
            ...data.map(item => ({ ...item, _id: Math.random().toString() })),
            ...data.map(item => ({ ...item, _id: Math.random().toString() })),]);
        }
    }, []);
    */

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
                        data={resources.categoryInfo}
                        numColumns={numColumns}
                        keyExtractor={(item: CategoryInfo) => item.categoryName}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.thumbnail}
                                onPress={() => navigation.navigate('Category', { categoryInfo: item, stories: resources.stories.filter(story => story.category === item.categoryName) })}
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

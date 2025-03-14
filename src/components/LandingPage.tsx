import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Text, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getCategoryInfo } from '../api/getCategoryInfo';
import { BackendResource, CategoryInfo, Story } from '../types';
import getCachedResource from '../utils/getCachedResource';
import { getStyles } from './LandingPage.styles';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';
import { useResources } from '../contexts/ResourceContext';
import { constants } from '../constants';

export const LandingPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Landing'>>();
    const { stories, categoryInfo } = useResources();

    const { screenWidth, screenHeight, isTablet } = useScreenDimensions();
   

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 3 : 2), [screenWidth, screenHeight]);
    const itemWidth = useMemo(() => screenWidth / numColumns, [screenWidth, numColumns]);

    const styles = getStyles(screenWidth, screenHeight, isTablet, itemWidth);

    const categoryIcons: Record<string, any> = {};

    for (const elem of categoryInfo) {
            categoryIcons[elem.categoryName] = 
            elem.categoryName ===  "animals" ? require(`../assets/images/animals_icon.png`) : 
            elem.categoryName === "nature" ? require(`../assets/images/nature_icon.png`) : 
            elem.categoryName === "space" ? require(`../assets/images/space_icon.png`) : 
            require(`../assets/images/vehicles_icon.png`)
    }
        

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
                        data={categoryInfo}
                        key={numColumns}
                        numColumns={numColumns}
                        keyExtractor={(item: CategoryInfo) => item.categoryName}
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
                                <Image source={categoryIcons[item.categoryName]} style={styles.categoryIcon} />
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center' }} // Centers last row
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

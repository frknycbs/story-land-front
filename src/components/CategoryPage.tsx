import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getStoriesByCategory } from '../api/getStoriesByCategory';
import { Story, CategoryInfo } from '../types';
import { getStyles } from './CategoryPage.styles';
import getCachedResource from '../utils/getCachedResource';
import { useScreenDimensions } from '../hooks/useDimensions';
import { getGeneralStyles } from './generalStyles';

type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;

export const CategoryPage = ({ route }: CategoryPageProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { categoryInfo }: { categoryInfo: CategoryInfo } = route.params;
    const [stories, setStories] = useState<Story[]>([]);
    const { screenWidth, screenHeight } = useScreenDimensions();

    const numColumns = useMemo(() => (screenWidth > screenHeight ? 5 : 3), [screenWidth, screenHeight]);
    // Calculate item width dynamically
    const itemWidth = screenWidth / numColumns;
    const styles = getStyles(screenWidth, screenHeight, itemWidth);

    const generalStyles = getGeneralStyles(screenWidth, screenHeight);


    useEffect(() => {
        const loadStories = async () => {
            const data: Story[] | null = await getStoriesByCategory(categoryInfo.categoryName);
            if (data) {
                for (const story of data)
                    story.thumbnailURL = await getCachedResource(story.thumbnailURL);

                // console.log('Stories loaded:', data);
                setStories([...data, ...data.map(story => ({ ...story, _id: Math.random().toString() })), ...data.map(story => ({ ...story, _id: Math.random().toString() }))]);
            }
        };
        loadStories();
    }, []);



    return (
        <>
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    navigation.goBack(); // Logic for going back
                }}
            >
                <Image
                    source={require('../assets/images/back_arrow.png')}
                    style={styles.backArrowImage}
                />
            </TouchableOpacity>

            <Image
                source={require('../assets/images/storyland_logo.png')}
                style={generalStyles.logoImage}
            />
            <Text style={styles.welcomeText}>
                Hi there! Pick your friend, and let's start!!
            </Text>

            <ScrollView horizontal={screenHeight > screenWidth}
                contentOffset={screenHeight > screenWidth ? { x: (screenHeight - screenWidth) / 2, y: 0 } : { x: 0, y: (screenWidth - screenHeight) / 2 }}
                showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>

                <ImageBackground
                    source={{ uri: categoryInfo.bgImageURL }}
                    style={styles.imageBackground}
                    resizeMode="cover">
                </ImageBackground>
            </ScrollView>


            <View style={styles.grid} pointerEvents="box-none">
                <FlatList
                    data={stories}
                    numColumns={numColumns}
                    key={numColumns}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                style={styles.thumbnail}
                                onPress={() => navigation.navigate('Story', { story: item })}
                            >
                                <Image source={{ uri: item.thumbnailURL }} style={styles.thumbnailImage} resizeMode="cover" />
                            </TouchableOpacity>
                            <Text style={styles.characterName}>Budy</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                />
            </View>
        </>
    );
};

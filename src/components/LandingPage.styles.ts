import { StyleSheet, Dimensions } from 'react-native';
import { constants } from '../constants';

export const getStyles = (screenWidth: number, screenHeight: number, isTablet: boolean, itemWidth: number) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Centers everything horizontally
    },
    gridWrapper: {
        position: 'absolute',
        top: screenHeight * 0.05 + (isTablet ? constants.imageSizeLarge / 2 : constants.imageSizeSmall / 2),
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
        pointerEvents: 'box-none',
        alignSelf: 'stretch',  // Prevents layout collapse
    },
   
    categoryImage: {
        flex: 1,
        resizeMode: 'cover',
    },
   
    categoryIcon: {
        position: 'absolute',
        width: isTablet ? 100 : 60,
        height: isTablet ? 100 : 60,
        alignSelf: 'center',
        bottom: isTablet ? 50 : 30
    },

    categoryName: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: isTablet ? constants.fontSizeMedium : (Math.min(screenHeight, screenWidth) > 360 ? constants.fontSizeXs : constants.fontSizeXxs),
        fontFamily: constants.fontFamily,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        color: '#fff',
        textAlign: 'center',
    },

    thumbnail: {
        aspectRatio: 1,
        borderColor: '#000',
        borderWidth: 3,
        overflow: 'hidden',
        pointerEvents: 'auto', // Ensure it's clickable
        ...(screenHeight > screenWidth
            ? { // Portrait mode
                width: itemWidth,
                // marginHorizontal: 15, // Add spacing so background remains visible
                // marginVertical: 5
            }
            : { // Landscape mode
                width: itemWidth,
                // marginHorizontal: 15, // Add spacing so background remains visible

            }),
    },

    logoImage: {
        position: 'absolute',
        alignSelf: 'center',
        width: isTablet ? constants.imageSizeLarge :constants.imageSizeSmall,
        height: isTablet ? constants.imageSizeLarge : constants.imageSizeSmall,
        top: screenHeight * 0.05,
        zIndex: 2,
        aspectRatio: 1,
      
    },
});

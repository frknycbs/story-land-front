import { StyleSheet, Dimensions } from 'react-native';
import { constants } from '../constants';

export const getStyles = (screenWidth: number, screenHeight: number, itemWidth: number) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Centers everything horizontally
    },
    gridWrapper: {
        position: 'absolute',
        top: screenWidth > screenHeight ? 80 : 120,  // Stable fixed position
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
        pointerEvents: 'box-none',
        alignSelf: 'stretch',  // Prevents layout collapse
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    welcomeText: {
        fontFamily: 'BubblegumSans',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff', // White text for better contrast against space background
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    categoryImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    categoryNameContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
        padding: 10,
    },
    adContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    listContainer: {
        // paddingBottom: 40,  // Avoids cut-off content at the bottom
    },
    columnWrapper: {
        justifyContent: 'space-around', // Space out columns to leave gaps for scrolling
        // marginBottom: screenWidth > screenHeight ? 10 : 40, // Increase spacing between rows
    },

    categoryName: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: 20,
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
        zIndex: 10,
        aspectRatio: 1,
        ...(screenHeight > screenWidth
            ? { // Portrait mode
                width: constants.categoryLogoImageSize, // Small size
                height: constants.categoryLogoImageSize, // Small size
                top: 120,
                left: '50%', // Center horizontally
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // Shift left and up by half its size

            }
            : { // Landscape mode
                width: constants.categoryLogoImageSize,
                height: constants.categoryLogoImageSize,
                top: 80,
                left: '50%', // Center horizontally
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // Shift left and up by half its size
            }),
    },
});

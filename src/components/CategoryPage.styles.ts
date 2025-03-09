import { StyleSheet } from "react-native";
import { constants } from "../constants";

export const getStyles = (screenWidth: number, screenHeight: number, itemWidth: number) => StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
    },
    imageBackground: {
        aspectRatio: 1,
        zIndex: 2,
        ...(screenHeight > screenWidth
            ? { // Portrait mode
                height: '100%',
            }
            : { // Landscape mode
                width: '100%',
            }),
    },
    grid: {
        position: 'absolute',
        zIndex: 1,
        top: screenWidth > screenHeight ? '30%' : '32%',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // Ensure it doesn’t block touches
        pointerEvents: 'box-none', // Allows touch events to pass through empty areas
    },
    listContainer: {
        paddingVertical: 40, // Add space to ensure background is visible
        pointerEvents: 'box-none', // Allows background scroll
    },
    columnWrapper: {
        justifyContent: 'space-around', // Space out columns to leave gaps for scrolling
        marginBottom: screenWidth > screenHeight ? 10 : 40, // Increase spacing between rows
    },
    thumbnail: {
        aspectRatio: 1,
        borderRadius: 100,
        borderColor: '#000',
        borderWidth: 3,
        overflow: 'hidden',
        pointerEvents: 'auto', // Ensure it's clickable
        ...(screenHeight > screenWidth
            ? { // Portrait mode
                width: itemWidth - 40,
                marginHorizontal: 15, // Add spacing so background remains visible
                marginVertical: 5
            }
            : { // Landscape mode
                width: itemWidth - 75,
                marginHorizontal: 15, // Add spacing so background remains visible

            }),
    },

    thumbnailImage: {
        flex: 1,
        resizeMode: 'cover',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },

    backButton: {
        position: 'absolute',
        top: 20, // Adjust as needed
        left: 15, // Adjust as needed
        zIndex: 1, // Ensure it's above other content
    },
    backArrowImage: {
        width: 50, // Small size
        height: 50, // Small size
        resizeMode: 'contain',
    },

    welcomeText: {
        position: 'absolute',
        alignSelf: 'center', // Centers the text horizontally
        zIndex: 1,
        fontFamily: 'BubblegumSans',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        color: '#fff',
        textAlign: 'center', // Ensures multiline text stays centered
        ...(screenHeight > screenWidth
            ? {
                top: constants.categoryLogoImageSize + 60,
                fontSize: 28,
                marginHorizontal: 20, // Adds left & right margins
                maxWidth: '80%', // Prevents it from stretching too wide
            } : {
                top: constants.categoryLogoImageSize / 2 + 10,
                left: constants.categoryLogoImageSize + 80,
                fontSize: 28,
                marginHorizontal: 30, // Adds left & right margins
                maxWidth: '80%', // Prevents it from stretching too wide
            }),


    },

    itemContainer: {
        alignItems: 'center', // Centers the name below the image
       
    },
    
    characterName: {
        fontSize: 20,
        fontFamily: constants.fontFamily,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2,
        color: '#fff',
        textAlign: 'center',
    },
});

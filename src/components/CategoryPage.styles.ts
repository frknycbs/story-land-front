import { StyleSheet } from "react-native";
import { constants } from "../constants";

export const getStyles = (screenWidth: number, screenHeight: number, isTablet: boolean, itemWidth: number) => StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
    },

    headerContainer: {
        flex: 1,
        zIndex: 1,
        flexDirection: screenWidth > screenHeight ? 'row' : 'column',
        // justifyContent: 'space-between',
    },

    logoImage: {
        width: isTablet ? constants.imageSizeSmall : constants.imageSizeXs,
        height: isTablet ? constants.imageSizeSmall : constants.imageSizeXs,

        ...(screenHeight > screenWidth
            ? { // Portrait mode
                marginTop: screenHeight * 0.05,
                alignSelf: 'center'
            }
            : { // Landscape mode
                marginTop: isTablet ? screenHeight * 0.1 :screenHeight * 0.1,
                marginLeft: isTablet ? screenWidth * 0.05 :screenWidth * 0.1, 
            }),
    },

    welcomeText: {
        height: 100,
        fontFamily: 'BubblegumSans',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        color: '#fff',
        textAlign: 'center', // Ensures multiline text stays centered
        maxWidth: '80%', // Prevents it from stretching too wide
        fontSize: isTablet ? constants.fontSizeLarge : (Math.min(screenHeight, screenWidth) > 350 ? constants.fontSizeSmall : constants.fontSizeXs),
        
        ...(screenHeight > screenWidth
            ? {
                marginTop: 10,
                alignSelf: 'center', // Centers the text horizontally
                
            } : {
                marginTop: isTablet ? screenHeight * 0.1 + constants.imageSizeSmall / 3 : screenHeight * 0.1 + constants.imageSizeXs / 3,
                marginLeft: isTablet ? 10 : 10,
                maxWidth: '80%', // Prevents it from stretching too wide
            }),


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
        top: screenWidth > screenHeight ? screenHeight * 0.3 : (isTablet ? screenHeight * 0.25 : ( Math.max(screenHeight, screenWidth) > 700 ? screenHeight * 0.3 : screenHeight * 0.25) ),
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
        marginBottom: screenWidth > screenHeight ? 10 : ( Math.max(screenHeight, screenWidth) > 700 ? screenHeight * 0.05 : screenHeight * 0.02), // Increase spacing between rows
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
                width: isTablet ? constants.imageSizeMedium : (screenHeight > 700 ? constants.imageSizeXs : constants.imageSizeXxs),
                marginHorizontal: isTablet ? 15 : 10, // Add spacing so background remains visible
                marginVertical: 5
            }
            : { // Landscape mode
                width: isTablet ? constants.imageSizeSmall : (screenHeight > 350 ? constants.imageSizeXxs : constants.imageSizeXxxs),
                marginHorizontal: isTablet ? 15 : 10, // Add spacing so background remains visible

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

    

    itemContainer: {
        alignItems: 'center', // Centers the name below the image
       
    },
    
    characterName: {
        fontSize: isTablet ? constants.fontSizeMedium : constants.fontSizeXxs,
        fontFamily: constants.fontFamily,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2,
        color: '#fff',
        textAlign: 'center',
    },
});

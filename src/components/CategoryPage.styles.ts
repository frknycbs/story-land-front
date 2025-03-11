import { StyleSheet } from "react-native";
import { constants } from "../constants";

export const getStyles = (screenWidth: number, screenHeight: number, itemWidth: number) => StyleSheet.create({
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
        width: constants.categoryLogoImageSize,
        height: constants.categoryLogoImageSize,

        ...(screenHeight > screenWidth
            ? { // Portrait mode
                marginTop: '10%',
                alignSelf: 'center'
            }
            : { // Landscape mode
                marginTop: '5%',
                left: '10%', 
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
        
        ...(screenHeight > screenWidth
            ? {
                marginTop: 10,
                alignSelf: 'center', // Centers the text horizontally
                fontSize: 28,
                
            } : {
                marginTop: 10 + constants.categoryLogoImageSize / 2,
                fontSize: 28,
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

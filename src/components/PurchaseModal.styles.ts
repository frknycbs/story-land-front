import { StyleSheet } from "react-native";
import { constants } from "../constants";

export const getStyles = (screenWidth: number, screenHeight: number, isTablet: boolean, isPortrait: true | false) => StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // This will cover the entire screen
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        borderRadius: 30,
        borderColor: 'black',
        borderWidth: 4,
        overflow: 'hidden',

        
        ...(isTablet ? { 
            width: 400,
            height: 500,
        } : { 
            width: isPortrait ? 300 : 400,
            height: isPortrait ? 420 : 320,
        }),
    },

    purchaseProgressBar: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: isPortrait ? -50 : -80,
        width: isPortrait ? 225 : 300,
        height: 12,
        backgroundColor: "rgb(0, 119, 0)",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "rgb(0, 202, 0)",
        overflow: "hidden",

        ...isTablet && {
            bottom: -50,
            width: 300
        }
       
    },

    splashProgressBar: {
        width: "80%",
        height: Math.min(screenHeight, screenWidth) > 350 ? 20 : 15,
        backgroundColor: "#FFE4B5",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#FFB74D",
        overflow: "hidden",
        marginTop: 20,
    },

    imageBackground: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        position: 'absolute',
        top: 20,
        fontFamily: 'BubblegumSans',
        fontSize: isTablet ? constants.fontSizeLarge : constants.fontSizeSmall,
        textAlign: 'center',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        marginBottom: 30,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeText: {
        fontSize: 25,
        color: 'white',
        fontFamily: 'BubblegumSans',
    },
    thumbnail: {
        position: 'absolute',
        justifyContent: 'center',
        // marginBottom: 10,
        borderRadius: 50,
        borderColor: '#000',
        borderWidth: 3,
        width: isTablet ? constants.imageSizeMedium : constants.imageSizeSmall,
        height: isTablet ? constants.imageSizeMedium : constants.imageSizeSmall,
        top: isPortrait ? 80 : (isTablet ? 80 : 80),
        left: isPortrait ? null : (isTablet ? null : 20),
       
        // Landscape Mode (No need for centering, just place the image)
        // Position is kept on the left with 20px margin
        // In landscape mode, only left margin is needed
    },
    overlay: {
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        marginBottom: 15,
        borderRadius: 50,
        borderColor: '#000',
        // borderWidth: 3,
        width: isTablet ? constants.imageSizeMedium : constants.imageSizeSmall,
        height: isTablet ? constants.imageSizeMedium : constants.imageSizeSmall,
        top: isPortrait ? 80 : (isTablet ? 80 : 80),
        left: isPortrait ? null : (isTablet ? null : 20),

        // Landscape Mode (No need for centering, just place the image)
        // Position is kept on the left with 20px margin
        // In landscape mode, only left margin is needed
    },

    instructionText: {
        position : 'absolute',
        top: isTablet ? 300 : 250,
        fontFamily: 'BubblegumSans',
        fontSize: isTablet ? constants.fontSizeSmall : constants.fontSizeXxs,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        width: isTablet ? 300 : 200,

        ...!isPortrait && !isTablet && {
            top: 90,
            left: 180,
        }
    },

    offlineText: {
        position : 'absolute',
        top: isTablet ? 300 : 260,
        fontFamily: 'BubblegumSans',
        fontSize: isTablet ? constants.fontSizeSmall : constants.fontSizeXxs,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        width: isTablet ? 300 : 220,

        ...!isPortrait && !isTablet && {
            width: 200,
            top: '40%',
            left: 180,
        }
    },
    
    purchaseButtonCombo: {
        position: 'absolute',
        top: isTablet ? 400 : 320,
        backgroundColor: 'rgb(0, 119, 0)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 5,

        ...!isPortrait && !isTablet && {
            top: 170,
            left: 210,
        }
    },
    buttonText: {
        color: 'white',
        fontFamily: 'BubblegumSans',
        fontSize: isTablet ? constants.fontSizeXs : constants.fontSizeXxs,
    },
    
    pendingContainer: {
        position: 'absolute',
        alignSelf: 'center',
        // top: isPortrait ? 180 : 100,
        // left: isPortrait ? 0 : 150,
        // right: 0,
        bottom: isPortrait ? -60 : -90,

        ...isTablet && {
            bottom: -60
        }
    },

    finalText: {
        fontFamily: 'BubblegumSans',
        fontSize: isTablet ? constants.fontSizeSmall : constants.fontSizeXxs,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        color: 'white',
        ...isPortrait && !isTablet && {
            width: 200,
            marginTop: 180,
            // marginLeft: 140,
        },

        ...!isPortrait && !isTablet && {
            width: 200,
            marginTop: 10,
            marginLeft: 160,
        },

        ...isTablet && {
            width: 300,
            marginTop: 240,
        }

    },

    pendingText: {
        fontFamily: 'BubblegumSans',
        // borderColor: 'black',
        // borderWidth: 2,
        fontSize: isTablet ? constants.fontSizeSmall : constants.fontSizeXxs,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        color: 'white',
        marginTop: isPortrait ? 160 : 240,
        ...!isPortrait && !isTablet && {
            width: 200,
            marginTop: 10,
            marginLeft: 160,
        },

        ...isTablet && {
            width: 300,
            marginTop: 220,
        }
    },



    closeImage: {
        marginRight: 5,
        marginTop: 5,
        width: 20,
        height: 20,

    }
});


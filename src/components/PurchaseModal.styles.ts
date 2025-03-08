import { StyleSheet } from "react-native";

export const getStyles = (screenWidth: number, screenHeight: number, isPortrait: true | false) => StyleSheet.create({
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
        width: isPortrait ? 300 : 400,
        height: isPortrait ? 420 : 280,
        borderRadius: 30,
        borderColor: 'black',
        borderWidth: 4,
        overflow: 'hidden'
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
        fontSize: 30,
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
        marginBottom: 15,
        borderRadius: 100,
        borderColor: '#000',
        borderWidth: 3,
        width: 150,
        height: 150,
        top: 70,

        ...!isPortrait && {
            top: '35%',
            left: 20,
        }
        // Landscape Mode (No need for centering, just place the image)
        // Position is kept on the left with 20px margin
        // In landscape mode, only left margin is needed
    },
    overlay: {
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        marginBottom: 15,
        borderRadius: 100,
        borderColor: '#000',
        borderWidth: 3,
        width: 150,
        height: 150,
        top: 70,

        ...!isPortrait && {
            top: '35%',
            left: 20,
        }
        // Landscape Mode (No need for centering, just place the image)
        // Position is kept on the left with 20px margin
        // In landscape mode, only left margin is needed
    },

    instructionText: {
        position : 'absolute',
        top: 230,
        fontFamily: 'BubblegumSans',
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        width: 200,

        ...!isPortrait && {
            top: '40%',
            left: 180,
        }
    },

    offlineText: {
        position : 'absolute',
        top: 260,
        fontFamily: 'BubblegumSans',
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 2,
        width: 220,

        ...!isPortrait && {
            width: 200,
            top: '40%',
            left: 180,
        }
    },
    
    purchaseButtonCombo: {
        position: 'absolute',
        top: 300,
        backgroundColor: 'rgb(0, 119, 0)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,

        ...!isPortrait && {
            top: '65%',
            left: 210,
        }
    },
    buttonText: {
        color: 'white',
        fontFamily: 'BubblegumSans',
        fontSize: 18,
    },
    
    pendingContainer: {
        position: 'absolute',
        top: isPortrait ? 180 : 100,
        left: isPortrait ? 0 : 150,
        right: 0,
    },

    finalText: {
        fontFamily: 'BubblegumSans',
        fontSize: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        color: 'white',
        ...isPortrait && {
            width: 200,
            marginTop: 180,
            // marginLeft: 140,
        },

        ...!isPortrait && {
            width: 200,
            marginTop: 10,
            marginLeft: 160,
        }

    },

    pendingText: {
        fontFamily: 'BubblegumSans',
        // borderColor: 'black',
        // borderWidth: 2,
        fontSize: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        color: 'white',
        marginTop: 240,
        ...!isPortrait && {
            width: 200,
            marginTop: 10,
            marginLeft: 160,
        }
    },



    closeImage: {
        marginRight: 5,
        marginTop: 5,
        width: 20,
        height: 20,

    }
});


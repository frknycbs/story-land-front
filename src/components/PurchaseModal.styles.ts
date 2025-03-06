import { StyleSheet } from "react-native";

export const getStyles = (screenWidth: number, screenHeight: number, isPortrait: true | false) => StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // This will cover the entire screen
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        width: isPortrait ? 300 : 400,
        height: isPortrait ? 420 : 280,
        backgroundColor: 'rgb(255, 137, 40)',
        padding: 20,
        borderRadius: 10,
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

        ...!isPortrait && {
            top: '30%',
            left: 200,
        }
    },
    
    purchaseButtonCombo: {
        position: 'absolute',
        top: 350,
        backgroundColor: 'rgb(96, 58, 20)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 5,

        ...!isPortrait && {
            top: '76%',
            left: 216,
        }
    },
    buttonText: {
        color: 'white',
        fontFamily: 'BubblegumSans',
        fontSize: 18,
    },
    
    pendingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    finalText: {
        fontFamily: 'BubblegumSans',
        fontSize: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        color: 'white',
        marginTop: 120,
        ...!isPortrait && {
            marginLeft: 140,
        }
    }
});


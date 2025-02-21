import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollContainer: {
        flexGrow: 1, // Prevents collapsing
    },
    imageBackground: {
        height: '100%', // Make it fit height
        aspectRatio: 1, // Maintain original aspect ratio
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 15,
        zIndex: 1,
    },
    backArrowImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    playButton: {
        position: 'absolute',
        top: '50%', // Start at 50% from the top
        left: '50%', // Start at 50% from the left
        transform: [{ translateX: -50 }, { translateY: -50 }], // Shift left and up by half its size
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      buttonText: {
        fontSize: 24,
        color: '#8A2BE2', // Purple color to match the theme
        fontWeight: 'bold',
        textAlign: 'center'
      }
});


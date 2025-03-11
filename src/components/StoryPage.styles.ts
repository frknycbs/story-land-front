import { StyleSheet } from "react-native";


export const getStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    imageBackground: {
        aspectRatio: 1,
        ...(screenHeight > screenWidth
            ? { // Portrait mode
                height: '100%',
            }
            : { // Landscape mode
                width: '100%',
            }),
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

    speakerImage: {
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },

    speakerContainer: {
        position: 'absolute',
        top: 20,
        right: 15,
        zIndex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    playButton: {
        position: 'absolute',
        alignSelf: 'center',
        top: screenHeight * 0.5 - 75,
        zIndex: 1,
    },

    pauseButton: {
        position: 'absolute',
        alignSelf: 'center',
        top: screenHeight * 0.5 - 60,
        zIndex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
    },
    pauseImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },

    playImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    progressContainer: {
        width: screenWidth,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    timeText: {
        width: '90%',
        color: '#fff',
        fontSize: 14,
        paddingLeft: 20,
        paddingTop: 10,
    },
    slider: {
        width: '90%',
        height: 20,
    },
  });


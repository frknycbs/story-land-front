import { StyleSheet } from "react-native";
import { constants } from "../constants";

export const getGeneralStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
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
                    left: '20%', // Center horizontally
                    transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // Shift left and up by half its size
                }),
    },
});
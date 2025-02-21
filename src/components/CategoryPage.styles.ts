import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
    },
    grid: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    thumbnail: {
        width: '15%',
        aspectRatio: 1,
        margin: 8,
        borderRadius: 100,
        overflow: 'hidden',
    },
    thumbnailImage: {
        flex: 1,
        resizeMode: 'cover',
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
});

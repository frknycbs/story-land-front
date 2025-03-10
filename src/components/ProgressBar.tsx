import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { getStyles } from './PurchaseModal.styles';
import { useScreenDimensions } from "../hooks/useDimensions";

interface ProgressBarProps {
    numResourcesCached: number;
    numTotal: number;
    type: "splash" | "purchase";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ numResourcesCached, numTotal, type }) => {
     const { screenWidth, screenHeight } = useScreenDimensions();
     const isPortrait = screenHeight > screenWidth;

    const styles = getStyles(screenWidth, screenHeight, isPortrait)
    const progress = new Animated.Value(Math.min((numResourcesCached / numTotal) * 100, 100));

    useEffect(() => {
        Animated.timing(progress, {
            toValue: Math.min((numResourcesCached / numTotal) * 100, 100), // Clamp to max 100
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [numResourcesCached]);

    const widthInterpolation = progress.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={ type === "splash" ? styles.splashProgressBar : styles.purchaseProgressBar}>
            <Animated.View
                style={{
                    width: widthInterpolation,
                    height: "100%",
                    backgroundColor: type === "splash" ? "#FF8C00" : "rgb(0, 202, 0)",
                    borderRadius: 10,
                }}
            />
        </View>
    );
};



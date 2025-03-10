import { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, ImageBackground, Animated } from 'react-native';
import { useScreenDimensions } from '../hooks/useDimensions';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './PurchaseModal.styles';
import { Story } from '../types';
import { StatusBar } from 'expo-status-bar';
import { useResources } from '../contexts/ResourceContext';
import { ProgressBar } from './ProgressBar';

// The Purchase Modal Component
interface PurchaseModalProps {
    visible: boolean;
    onClose: () => void;
    name: string;
    productId: string;
    handlePurchase: (productId: string) => Promise<void>;
    purchaseStatus: "init" | "pending" | "failed" | "success";
    setPurchaseStatus: (status: "init" | "pending" | "failed" | "success") => void;
    numResourcesCached: number;
    numResourcesTotal: number;
    progressBarVisible: boolean;
}

export const PurchaseModal = ({ visible, onClose, name, productId, 
        handlePurchase, purchaseStatus, setPurchaseStatus, numResourcesCached, numResourcesTotal, progressBarVisible }: PurchaseModalProps) => {
    const { screenWidth, screenHeight } = useScreenDimensions();

    const isPortrait = screenHeight > screenWidth;
    const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
    const { stories, googlePlayAvailable, isBackendOnline } = useResources();

    const story: Story = stories.find(story => story.name === name)!

    const backgroundColor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            const animateColor = () => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(backgroundColor, {
                            toValue: 1,  // Start from 0 and go to 1
                            duration: 2000,  // Duration of animation (1 second)
                            useNativeDriver: false,  // We need this to animate color
                        }),
                        Animated.timing(backgroundColor, {
                            toValue: 0,  // Go back to 0
                            duration: 2000,  // Duration of animation (1 second)
                            useNativeDriver: false,  // We need this to animate color
                        }),
                    ])
                ).start();
            };

            animateColor();
        } else {
            // Reset the animated value when modal is closed
            backgroundColor.setValue(0); // Reset the color animation when the modal closes
        }
    }, [visible]);

    // Interpolate backgroundColor value to switch between the two colors
    const animatedBackgroundColor = backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(0, 202, 0)', 'rgb(0, 119, 0)'],  // Your color transition
    });

    // Reset state when modal becomes visible
    useEffect(() => {
        if (visible) {
            console.log("Resetting purchase state")
            setPurchaseStatus('init');
        }
    }, [visible]);

    useEffect(() => {
        console.log("Purchase: ", purchaseStatus)
        if (purchaseStatus === "pending" || purchaseStatus === "init")
            return

        // If here, purchase finished
        timeoutRef.current = setTimeout(clearAndClose, 2000); // Close after 2 seconds

    }, [purchaseStatus]);

    // Function to clear timeout safely
    const clearAndClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        onClose();
    };

    const handleButtonPress = async () => {
        await handlePurchase(productId); // Mock purchase handler
    };

    const styles = getStyles(screenWidth, screenHeight, isPortrait);

    return (
        <Modal visible={visible} statusBarTranslucent={true} transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('../assets/images/purchasemodalbg.jpg')}
                        style={styles.imageBackground}
                        resizeMode="cover">
                        {/* Title */}
                        <Text style={styles.title}>Unlock All</Text>

                        {/* Close Icon */}
                        <TouchableOpacity onPress={() => { clearAndClose(); }} style={styles.closeButton}>
                            <Image source={require('../assets/images/close.png')} style={styles.closeImage} />
                        </TouchableOpacity>

                        {/* Thumbnail */}
                        
                         <Image source={{ uri: story.disabled ? story.disabledThumbnailURL : story.thumbnailURL }}
                            style={styles.thumbnail} resizeMode="cover" />
                            
                        {story.disabled && <View style={styles.overlay}></View>}
                       
                       

                        {purchaseStatus === 'init' && (
                            <>
                                {isBackendOnline && googlePlayAvailable && 
                                    <Text style={styles.instructionText}>If you want, you can unlock all my friends!!! 🎉✨</Text>}
                                
                                {!googlePlayAvailable && isBackendOnline &&
                                    <Text style={styles.offlineText}>It seems you don't have a Google Play account available, 
                                    so you can't unlock us... 😢😢</Text>}
                                
                                {!isBackendOnline &&
                                    <Text style={styles.offlineText}>I think you or Storyland is offline, so you can't unlock us  😢😢</Text>}

                                {/* "All My Friends" Button */}
                                {isBackendOnline && googlePlayAvailable && <Animated.View
                                    style={[
                                        styles.purchaseButtonCombo,
                                        { backgroundColor: animatedBackgroundColor }, // Apply animated background color
                                    ]}
                                >
                                   <TouchableOpacity onPress={handleButtonPress}>
                                        <Text style={styles.buttonText}>Unlock All 🔓</Text>
                                    </TouchableOpacity>
                                </Animated.View>}
                            </>
                        )}

                        {/* Pending, Success, Failed state */}
                        {purchaseStatus === 'pending' && (
                            <View>
                                {!progressBarVisible && <ActivityIndicator size="large" color="rgb(0,0,0)" style={styles.pendingContainer} />}
                                <Text style={styles.pendingText}>Can you please wait for a little bit? Unlocking all my friends... </Text>
                                {progressBarVisible && <ProgressBar numResourcesCached={numResourcesCached} numTotal={numResourcesTotal} type='purchase'/>}
                            </View>

                        )}
                        {purchaseStatus === 'success' && (
                            <Text style={styles.finalText}>Yay! we are unlocked! 💖 Now, it's time to play! ☀️</Text>
                        )}
                        {purchaseStatus === 'failed' && (
                            <Text style={styles.finalText}>Oh, we are not unlocked, maybe something went wrong... 😢 </Text>
                        )}
                    </ImageBackground>
                </View>
            </View>
        </Modal>
    );
};
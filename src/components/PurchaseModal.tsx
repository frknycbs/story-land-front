import { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useScreenDimensions } from '../hooks/useDimensions';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './PurchaseModal.styles';
import { Story } from '../types';
import { StatusBar } from 'expo-status-bar';

// The Purchase Modal Component
interface PurchaseModalProps {
    visible: boolean;
    onClose: () => void;
    item: Story;
    productId: string;
    handlePurchase: (productId: string) => Promise<void>;
    purchaseStatus: "init" | "pending" | "failed" | "success";
    setPurchaseStatus: (status: "init" | "pending" | "failed" | "success") => void;
}

export const PurchaseModal = ({ visible, onClose, item, productId, handlePurchase, purchaseStatus, setPurchaseStatus }: PurchaseModalProps) => {
    const { screenWidth, screenHeight } = useScreenDimensions();
    const [all, setAll] = useState(false)


    const isPortrait = screenHeight > screenWidth;
    const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);


    // Reset state when modal becomes visible
    useEffect(() => {
        if (visible) {
            console.log("Resetting purchase state")
            setPurchaseStatus('init');
        }
    }, [visible]);

    useEffect(() => {
        if (purchaseStatus === "pending") {
            console.log("Purchase pending")
        }
        if (purchaseStatus === "success") {
            console.log("Purchase successful")
            handleSuccess();
        } else if (purchaseStatus === "failed") {
            console.log("Purchase failed")
            handleFail();
        }
    }, [purchaseStatus]);

    // Function to clear timeout safely
    const clearAutoClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleSuccess = () => {
        console.log("In handleSuccess")
        timeoutRef.current = setTimeout(onClose, 2000); // Close after 2 seconds
    };

    const handleFail = () => {
        console.log("In handleFail")
        timeoutRef.current = setTimeout(onClose, 2000); // Close after 2 seconds
    };

    const handleButtonPress = async (type: 'justMe' | 'allFriends') => {
        if (type === 'allFriends') setAll(true)

        await handlePurchase(productId); // Mock purchase handler
    };

    const styles = getStyles(screenWidth, screenHeight, isPortrait);

    return (
        <Modal visible={visible} statusBarTranslucent={true} transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Title */}
                    <Text style={styles.title}>Unlock {all ? 'All' : item.name[0].toUpperCase() + item.name.slice(1)}</Text>

                    {/* Close Icon */}
                    <TouchableOpacity onPress={() => { clearAutoClose(); onClose(); }} style={styles.closeButton}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>

                    {/* Thumbnail */}
                    <Image source={{ uri: item.thumbnailURL }} style={styles.thumbnail} resizeMode="contain" />

                    {purchaseStatus === 'init' && (
                        <>
                            <Text style={styles.instructionText}>If you want, you can unlock</Text>

                            {/* "All My Friends" Button */}
                            <TouchableOpacity onPress={() => handleButtonPress('allFriends')} style={styles.purchaseButtonCombo}>
                                <Text style={styles.buttonText}>All My Friends</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Pending, Success, Failed state */}
                    {purchaseStatus === 'pending' && (
                        <View style={styles.pendingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.finalText}>Can you please wait for a little bit...</Text>
                        </View>

                    )}
                    {purchaseStatus === 'success' && (
                        <Text style={styles.finalText}>Yay! {all ? 'We are' : 'I am'} unlocked! Now, it's time to play! </Text>
                    )}
                    {purchaseStatus === 'failed' && (
                        <Text style={styles.finalText}>Oh, {all ? 'We are' : 'I am'} not unlocked. Maybe something went wrong...</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};
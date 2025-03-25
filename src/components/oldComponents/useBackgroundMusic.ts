/*
import React, { useCallback } from "react";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native"; // React Navigation focus effect
import { useResources } from "../contexts/ResourceContext";

const musicFiles = {
    main: require("../assets/sounds/main.mp3"),
    loading: require("../assets/sounds/loading.mp3"),
    success: require("../assets/sounds/success.mp3"),
};

const useBackgroundMusic = (choice: "main" | "loading" | "success" | "stop") => {
    const { sound, setSound, currentChoice, setCurrentChoice } = useResources();

    useFocusEffect(
        useCallback(() => {
            const playSound = async () => {
                if (choice === "stop") {
                    if (sound) {
                        await sound.unloadAsync();
                        setSound(null);
                        setCurrentChoice(null);
                    }
                    return;
                }

                // If the choice is the same as the current one, do nothing
                if (choice === currentChoice) return;

                try {
                    const { sound: newSound } = await Audio.Sound.createAsync(musicFiles[choice], {
                        shouldPlay: true,
                        isLooping: true,
                    });

                    // Stop and unload previous sound if it exists
                    if (sound) {
                        await sound.stopAsync();
                        await sound.unloadAsync();
                    }

                    setSound(newSound);
                    setCurrentChoice(choice);
                    
                    await newSound.playAsync();
                } catch (error) {
                    console.error("Error playing sound:", error);
                }
            };

            playSound();

            // Cleanup function for when effect re-runs or screen unmounts
            return () => {
                console.log("Sound loaded: ", sound ? "true" : "false", ", cleanup for ", choice)
                if(choice === "main")
                    return 

                if (sound) {
                    sound.unloadAsync();
                    setSound(null);
                    setCurrentChoice(null);
                }
            };
        }, [choice, sound, currentChoice, setSound, setCurrentChoice])
    );
};

export default useBackgroundMusic;
*/
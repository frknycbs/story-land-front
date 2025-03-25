// StoriesContext.tsx
import React, { createContext, useContext, useRef, useState } from 'react';
import { CategoryInfo, Story } from '../types';
import { Audio } from 'expo-av';

interface ResourcesContextType {
    stories: Story[];
    setStories: (stories: Story[]) => void;
    categoryInfo: CategoryInfo[];
    setCategoryInfo: (categoryInfo: CategoryInfo[]) => void;
    isBackendOnline: boolean | null;
    setIsBackendOnline: (status: boolean | null) => void;
    googlePlayAvailable: boolean;
    setGooglePlayAvailable: (status: boolean) => void;
    bgMusic: Audio.Sound | null;
    setBgMusic: (sound: Audio.Sound | null) => void;
    isBgMusicPlaying: boolean;
    setIsBgMusicPlaying: (status: boolean) => void
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

const musicFiles = {
    main: require("../assets/sounds/main.mp3"),
    loading: require("../assets/sounds/loading.mp3"),
    success: require("../assets/sounds/success.mp3"),
};

export const ResourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [categoryInfo, setCategoryInfo] = useState<CategoryInfo[]>([]);
    const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
    const [googlePlayAvailable, setGooglePlayAvailable] = useState<boolean>(false);
    const [bgMusic, setBgMusic] = useState<Audio.Sound | null>(null);
    const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);

    return (
        <ResourcesContext.Provider
            value={{
                stories, setStories, categoryInfo, setCategoryInfo, isBackendOnline, setIsBackendOnline,
                googlePlayAvailable, setGooglePlayAvailable, bgMusic, setBgMusic, isBgMusicPlaying, setIsBgMusicPlaying
            }}>
            {children}
        </ResourcesContext.Provider>
    );
};

// Custom hook to use the context
export const useResources = () => {
    const context = useContext(ResourcesContext);
    if (!context) {
        throw new Error('useResources must be used within a ResourcesProvider');
    }
    return context;
};
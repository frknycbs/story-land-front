import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { constants } from '../constants';

export const useScreenDimensions = () => {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const isTablet = Math.max(screenWidth, screenHeight) >= constants.tabletSizeHeight && Math.min(screenWidth, screenHeight) > constants.tabletSizeWidth;

    useEffect(() => {
        const updateDimensions = () => {
            setScreenWidth(Dimensions.get('window').width);
            setScreenHeight(Dimensions.get('window').height);
        }

        const subscription = Dimensions.addEventListener('change', updateDimensions);
        console.log("Current Dimensions & isTablet: ", screenWidth, screenHeight, isTablet);


        return () => subscription?.remove();
    }, []);

    return { screenWidth, screenHeight, isTablet };
};

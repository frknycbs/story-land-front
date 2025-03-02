import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useScreenDimensions = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get('window').width);
      setScreenHeight(Dimensions.get('window').height);
    }

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    console.log("Current Dimensions: ", screenWidth, screenHeight);
    

    return () => subscription?.remove();
  }, []);

  return {screenWidth, screenHeight};
};

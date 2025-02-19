import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NativeAd, TestIds } from 'react-native-google-mobile-ads';

export const AdNative = () => {
 const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

 useEffect(() => {
   const loadNativeAd = async () => {
     try {
       const ad: NativeAd | null = await NativeAd.createForAdRequest(TestIds.NATIVE);
       setNativeAd(ad);
     } catch (error) {
       console.error('Error loading native ad:', error);
     }
   };

   loadNativeAd();

   return () => {
     if (nativeAd) {
       nativeAd.destroy();
     }
   };
 }, []);


 return (
    <>
        {nativeAd &&  <View>
     <Image source={{ uri: nativeAd.icon?.url }} style={{ width: 50, height: 50 }} />
     <Text>{nativeAd.headline}</Text>
     <Text>{nativeAd.body}</Text>
   </View>}
    </>
  
 );
};

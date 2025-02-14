import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../themes/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AgeSelection'>;
};

export const AgeSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const handleAgeSelection = (ageGroup: '0-3' | '3-6') => {
    navigation.navigate('GenderSelection', { ageGroup });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yaşını Seç</Text>
      
      <TouchableOpacity
        style={[styles.ageButton, { backgroundColor: colors.primary }]}
        onPress={() => handleAgeSelection('0-3')}
      >
        <Text style={styles.ageButtonText}>0-3 Yaş</Text>
        <Text style={styles.ageDescription}>Minik Kahramanlar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ageButton, { backgroundColor: colors.secondary }]}
        onPress={() => handleAgeSelection('3-6')}
      >
        <Text style={styles.ageButtonText}>3-6 Yaş</Text>
        <Text style={styles.ageDescription}>Büyük Maceralar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  ageButton: {
    width: '80%',
    padding: 20,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
  },
  ageButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  ageDescription: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
  },
});

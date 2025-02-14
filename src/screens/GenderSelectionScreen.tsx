import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../themes/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GenderSelection'>;
  route: RouteProp<RootStackParamList, 'GenderSelection'>;
};

export const GenderSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ageGroup } = route.params;

  const handleGenderSelection = (gender: 'boy' | 'girl') => {
    navigation.navigate('StoryList', { ageGroup, gender });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karakterini Seç</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.genderButton, { backgroundColor: colors.boy }]}
          onPress={() => handleGenderSelection('boy')}
        >
          <Text style={styles.genderButtonText}>Erkek</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, { backgroundColor: colors.girl }]}
          onPress={() => handleGenderSelection('girl')}
        >
          <Text style={styles.genderButtonText}>Kız</Text>
        </TouchableOpacity>
      </View>
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  genderButton: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  genderButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
});

import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../themes/colors';
import { stories, Story } from '../utils/stories';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StoryList'>;
  route: RouteProp<RootStackParamList, 'StoryList'>;
};

export const StoryListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ageGroup, gender } = route.params;

  const filteredStories = stories.filter(
    story => story.ageGroup === ageGroup && story.gender === gender
  );

  const renderStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyCard}
      onPress={() => navigation.navigate('StoryDetail', { 
        storyId: item.id,
        ageGroup,
        gender
      })}
    >
      <View style={styles.thumbnailPlaceholder} />
      <Text style={styles.storyTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masallar</Text>
      <FlatList
        data={filteredStories}
        renderItem={renderStoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
  storyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: colors.disabled,
  },
  storyTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
});

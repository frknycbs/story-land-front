import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  thumbnail: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 100,
    overflow: 'hidden',
  },
  thumbnailImage: {
    flex: 1,
    resizeMode: 'cover',
  }
});

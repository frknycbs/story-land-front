import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'center', // Centers everything horizontally
  },
  background: {
    flex: 1,
  },
  kittenImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  kittenImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3, // Black border around the kitten image
    borderColor: '#000',
  },
  welcomeText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000', // Adds depth to the text
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 4,
    fontFamily: 'Comic Sans MS', // A warm, cartoonish font (ensure it's supported or use a custom font)
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
  },
  categoryButton: {
    width: '45%',
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
  },
  categoryImageWrapper: {
    borderRadius: 25,  // Round corners
    overflow: 'hidden', // Ensure borderRadius applies
    borderWidth: 4, // Black border
    borderColor: 'black',
  },
  
  categoryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  categoryNameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    alignItems: 'center',
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

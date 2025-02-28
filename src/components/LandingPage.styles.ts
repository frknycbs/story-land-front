import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
// Calculate dimensions for a 2x2 grid with slightly narrower width
const categoryWidth = width / 2 -2; // Further reduced width to ensure two images fit in a row
const categoryHeight = height / 2 - 20; // Half the screen height minus some margin

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Centers everything horizontally
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  kittenImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 1,
  },
  kittenImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3, // Black border around the kitten image
    borderColor: '#000',
    zIndex: 10,
    position: 'absolute',
    top: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // White text for better contrast against space background
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 80,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  categoryButton: {
    width: categoryWidth,
    height: categoryHeight,
    margin: 0,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent white border
  },
  categoryImageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // Align child (text) to bottom
  },
  categoryNameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    padding: 10,
  },
  categoryName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  adContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

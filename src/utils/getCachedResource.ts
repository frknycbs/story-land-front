import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Fetches a resource from local cache or downloads it if not cached.
 * @param {string} resourceURL - The URL of the remote resource (image, audio, etc.).
 * @returns {Promise<string>} - The local file path of the resource.
 */
const getCachedResource = async (resourceURL: string): Promise<string> => {
  try {

    // Check if resourceURL is local, if so, return it as is
    if(resourceURL.startsWith("file:///"))
        return resourceURL

    // Check if the resource is already cached
    const cachedLocalURL = await AsyncStorage.getItem(resourceURL);
    if (cachedLocalURL) {
      // console.log('Resource found in cache:', cachedLocalURL);
      return cachedLocalURL;
    }

    // Define local file path (inside cache directory)
    const filename = resourceURL.split('/').pop(); // Extract file name from URL
    const localResourceURL = `${FileSystem.cacheDirectory}${filename}`;

    // Download the file if it doesn't exist locally
    // console.log('Downloading resource...');
    const { uri } = await FileSystem.downloadAsync(resourceURL, localResourceURL);

    // Store the local file path in AsyncStorage
    await AsyncStorage.setItem(resourceURL, uri);

    // console.log('Resource downloaded and cached:', uri);
    return uri;
  } catch (error) {
    console.error('Error caching resource:', error);
    return resourceURL; // Fallback to original URL if caching fails
  }
};

export default getCachedResource;

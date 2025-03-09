
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackendResource} from "../types";
import { Purchase } from "react-native-iap";
import { getAllResources } from "../api/getAllResources";
import getCachedResource from "./getCachedResource";

export const getResources = async (isBackendOnline: boolean | null, availablePurchases: Purchase[]): Promise<BackendResource | null> => {
    try {
        
        // IF we have cached resources, set them to context initially
        let cachedResources: BackendResource | null = null
        const resourcesCachedStr: string | null = await AsyncStorage.getItem("resources") || null
       

        cachedResources = resourcesCachedStr ? JSON.parse(resourcesCachedStr) : null
        if(cachedResources) {
            // console.log("There are cached resources, loading them up to the context...", JSON.stringify(cachedResources))
        }
       
        if (!isBackendOnline) {
            // Backend is down, so let's look at cached resources
            console.log("Backend seems down, looking for cached resources")
            if (!cachedResources)
                throw ("Device offline, and cache empty")

            console.log("Found cached resources, they should already be loaded...")
            return cachedResources
        }

        console.log("Backend is UP, updating resources")

        const resources: BackendResource | null = await getAllResources(availablePurchases);

        // Backend is online, but for some reason we couldn't access resources. Then if we have cache, stick with it
        if (!resources) {
            console.log("Can't fetch resources from backend for some reason, checking cache...")
            if (!cachedResources)
                throw ("Backend erroneous for some reason, and cache empty")
            console.log("Found resources from cache, they should already be loaded")
            return cachedResources
        }

        console.log("All resources fetched from backend, starting caching...")
        console.time("cache")

        // Now, we cache all resources concurrently
        await Promise.all(resources.categoryInfo.map(async (singleCategoryInfo) => {
            singleCategoryInfo.bgImageURL = await getCachedResource(singleCategoryInfo.bgImageURL);
        }));

        await Promise.all(resources.stories.map(async (story) => {
            if (!story.free) {
                story.disabledThumbnailURL = await getCachedResource(story.disabledThumbnailURL);
            }

            if (!story.disabled) {
                [story.audioURL, story.imageURL, story.thumbnailURL] = await Promise.all([
                    getCachedResource(story.audioURL),
                    getCachedResource(story.imageURL),
                    getCachedResource(story.thumbnailURL)
                ]);
            }
        }));

        console.log("Caching done, resources set in async storage, stories length: ", resources.stories.length)
        console.timeEnd("cache")
        await AsyncStorage.setItem("resources", JSON.stringify(resources))
      
        return resources
    }

    catch (err) {
        console.error("Error occured while fetching resources: ", err)
        return null
    }


}
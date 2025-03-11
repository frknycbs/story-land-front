
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackendResource} from "../types";
import { Purchase } from "react-native-iap";
import { getAllResources } from "../api/getAllResources";
import getCachedResource from "./getCachedResource";

export const getResources = async (
        isBackendOnline: boolean | null, 
        availablePurchases: Purchase[],
        setNumResourcesCached: React.Dispatch<React.SetStateAction<number>>,
        setNumResourcesTotal: React.Dispatch<React.SetStateAction<number>>,
        setProgressBarVisible: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<BackendResource | null> => {
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

        // Backend is online, decide whether we want to cache
        console.log("All resources fetched from backend, checking whether to re-cache...")
        if(cachedResources) {
            const enabledCountBackend = resources.stories.filter(story => !story.disabled).length
            const enabledCountCached = cachedResources ? cachedResources.stories.filter(story => !story.disabled).length : 0
            if (enabledCountCached >= enabledCountBackend) {
                console.log("Cache has equal or more enabled stories than backend, not re-caching...", enabledCountCached, enabledCountBackend)
                return cachedResources
            }
        }
        
    
        console.log("Either no cache, or backend has higher enabled stories than current cache, caching...")
        let numTotalResources: number = 0
        numTotalResources += resources.categoryInfo.length

        for(const story of resources.stories) {
            numTotalResources += story.disabled ? 1 : 4
        }

        setNumResourcesTotal(numTotalResources)
        setProgressBarVisible(true)

        // Now, we cache all resources concurrently
        await Promise.all(resources.categoryInfo.map(async (singleCategoryInfo) => {
            singleCategoryInfo.bgImageURL = await getCachedResource(singleCategoryInfo.bgImageURL);
            setNumResourcesCached((prev) => prev + 1);
        }));

        await Promise.all(resources.stories.map(async (story) => {
            if (!story.free) {
                story.disabledThumbnailURL = await getCachedResource(story.disabledThumbnailURL);
            }

            setNumResourcesCached((prev) => prev + 1);

            if (!story.disabled) {
                [story.audioURL, story.imageURL, story.thumbnailURL] = await Promise.all([
                    getCachedResource(story.audioURL),
                    getCachedResource(story.imageURL),
                    getCachedResource(story.thumbnailURL)
                ]);
                setNumResourcesCached((prev) => prev + 3);
            }
        }));

        console.log("Caching done, resources set in async storage, stories length: ", resources.stories.length)
       
        await AsyncStorage.setItem("resources", JSON.stringify(resources))
      
        return resources
    }

    catch (err) {
        console.error("Error occured while fetching resources: ", err)
        return null
    }


}
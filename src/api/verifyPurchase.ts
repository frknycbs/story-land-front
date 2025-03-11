import axios from "axios";
import { ProductPurchase } from "react-native-iap";
import { constants } from "../constants";
import { GooglePlayTransactionReceipt, GooglePlayVerifyPurchaseRequestBody, Story } from "../types";
import getCachedResource from "../utils/getCachedResource";

export const verifyPurchase = async (purchase: ProductPurchase, 
        setNumResourcesCached: React.Dispatch<React.SetStateAction<number>>,
        setNumResourcesTotal: React.Dispatch<React.SetStateAction<number>>,
        setProgressBarVisible: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<Story[] | null> => {
    try {
        const transactionReceipt: GooglePlayTransactionReceipt = JSON.parse(purchase.transactionReceipt)
        const reqBody: GooglePlayVerifyPurchaseRequestBody = {
            packageName: transactionReceipt.packageName,
            productId: transactionReceipt.productId,
            purchaseToken: transactionReceipt.purchaseToken,
            orderId: transactionReceipt.orderId
        }
        const response = await axios.post(constants.BACKEND_API_URL + `/purchase/verifyPurchase`, reqBody);
        if(!response.data)
            throw("No response data found")

        const stories: Story[] = response.data
        console.log("New purchased stories being cached: ", stories[0].category)

        let numTotalResources: number = 0
        
        for(const story of stories) {
            numTotalResources += story.disabled ? 1 : 4
        }

        setProgressBarVisible(true)
        setNumResourcesTotal(numTotalResources)
       

        await Promise.all(stories.map(async (story) => {
            if (!story.free) {
                story.disabledThumbnailURL = await getCachedResource(story.disabledThumbnailURL);
            }

            setNumResourcesCached((prev) => prev + 1)
            if (!story.disabled) {
                [story.audioURL, story.imageURL, story.thumbnailURL] = await Promise.all([
                    getCachedResource(story.audioURL),
                    getCachedResource(story.imageURL),
                    getCachedResource(story.thumbnailURL)
                ]);

                setNumResourcesCached((prev) => prev + 3);
            }
        }));
        
        
        // console.log("Purchase verification result:" , response.data);

        return stories;
    } catch (error: any) {
        console.error("Error fetching unlocked stories:", error.status ? error.response.data : error);
        return null;
    }
};
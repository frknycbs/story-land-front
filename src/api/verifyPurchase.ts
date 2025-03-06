import axios from "axios";
import { ProductPurchase } from "react-native-iap";
import { constants } from "../constants";
import { GooglePlayTransactionReceipt, GooglePlayVerifyPurchaseRequestBody, Story } from "../types";
import getCachedResource from "../utils/getCachedResource";

export const verifyPurchase = async (purchase: ProductPurchase): Promise<Story[] | null> => {
    try {
        const transactionReceipt: GooglePlayTransactionReceipt = JSON.parse(purchase.transactionReceipt)
        const reqBody: GooglePlayVerifyPurchaseRequestBody = {
            packageName: transactionReceipt.packageName,
            productId: transactionReceipt.productId,
            purchaseToken: transactionReceipt.purchaseToken
        }
        const response = await axios.post(constants.BACKEND_API_URL + `/purchase/verifyPurchase`, reqBody);
        if(!response.data)
            throw("No response data found")

        const stories: Story[] = response.data
        console.log("New purchased stories being cached: ", stories[0].category)
        for(const story of stories) {
            if(!story.free) 
                story.disabledThumbnailURL = await getCachedResource(story.disabledThumbnailURL)
            
            if(!story.disabled) {
                story.audioURL = await getCachedResource(story.audioURL)
                story.imageURL = await getCachedResource(story.imageURL)
                story.thumbnailURL = await getCachedResource(story.thumbnailURL)
            }
        }
        
        console.log("Purchase verification result:" , response.data);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching category info:", error.status ? error.response.data : error);
        return null;
    }
};
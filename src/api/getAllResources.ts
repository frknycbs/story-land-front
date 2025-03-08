import axios, { AxiosError } from 'axios';
import { constants } from '../constants';
import { BackendResource, GooglePlayTransactionReceipt, GooglePlayVerifyPurchaseRequestBody, Story } from '../types';
import { ProductPurchase } from 'react-native-iap';
import getCachedResource from '../utils/getCachedResource';

export const getAllResources = async (availablePurchases: ProductPurchase[]): Promise<BackendResource | null> => {
    try {

        if (!availablePurchases) {
            throw new Error("Available purchase list is required");
        }

        const reqBodies: GooglePlayVerifyPurchaseRequestBody[] = []

        for (const purchase of availablePurchases) {
            const transactionReceipt: GooglePlayTransactionReceipt = JSON.parse(purchase.transactionReceipt)
            const reqBody: GooglePlayVerifyPurchaseRequestBody = {
                packageName: transactionReceipt.packageName,
                productId: transactionReceipt.productId,
                purchaseToken: transactionReceipt.purchaseToken
            }

            reqBodies.push(reqBody)
        }

        const response = await axios.post(constants.BACKEND_API_URL + `/purchase/verifyAvailablePurchases`, reqBodies, { timeout: 5000 });

        if (!response.data)
            throw ("No response data found")

        const resources: BackendResource = response.data
        if (!resources.categoryInfo || resources.categoryInfo.length < 1)
            throw ("Category Info cannot be fetched from resources")

        if (!resources.stories || resources.stories.length < 1)
            throw ("Stories cannot be fetched from resources")

        // console.log("Caching done: ", JSON.stringify(resources, null, 4))

        return resources;
    } catch (error: any) {
        console.error("Error fetching resources:", error.status ? error.response.data : error);
        return null;
    }
};

// getStoriesByCategory("animals")

/* 

Example Response

*/ 
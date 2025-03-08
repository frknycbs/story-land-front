export interface Story {
    _id : string;
    text: string;
    title: string;
    name: string;
    characterName: string;
    category: Category;
    thumbnailURL: string;
    disabledThumbnailURL: string;
    audioURL: string;
    imageURL: string;
    free: boolean;
    disabled: boolean
}

export type CategoryInfo = {
    categoryName: Category,
    bgImageURL: string,
    _id: string
}

export interface BackendHealth {
    status: "OK";
    count: number;
}

export interface GooglePlayVerifyPurchaseRequestBody {
    purchaseToken: string;
    productId: string;
    packageName: string;
}

export interface GooglePlayPurchaseReceipt {
    developerPayloadAndroid: string; // ""
    packageNameAndroid: string; // "com.j_terry.StoryLandFront"
    purchaseStateAndroid: number; // 1
    obfuscatedProfileIdAndroid: string; // ""
    autoRenewingAndroid: boolean; // false
    isAcknowledgedAndroid: boolean; // false
    signatureAndroid: string; // "n+ED7Fzla+OmA96OmyaFdwa2DbBEkzX4SObNpn5IKBWavPRkAtM9eAuVnLCvxlinCbhU2Iqe0
        // qtGgf95nnN/o+o2afv8/EeQPLupqiU5K7ApU7NYt09yrcI8Jl8PJD/g+3skXCr4vnicZhgPy1oF5T3O4IxACbPnCfDetUChP6
        // 7HOLPJzT9vYZBTixI8cJBhQ6FN43ps+r4RuoDYUwf9HIL/ckdXLh5IuvoWBfJQHQHCTDxwZck+ZLAdCmARNHC6xID4JxttQBf
        // yY8qwjoKo0V5KBeDdgtHLLiNiJ1lbd8ghf0Xd2gkYDk2dDJ8mDEC+fnp/al3KQdbyOaa6FhiAsA=="

    dataAndroid: string; // "{\"orderId\":\"GPA.3325-6870-5718-77771\",\"packageName\":\"com.j_terry.StoryLandFront\",
        // \"productId\":\"test_product\",\"purchaseTime\":1741178183947,\"purchaseState\":0,
        // \"purchaseToken\":\"ophheechdfbmbffdcccdfdof.AO-J1OyH489yJNHap6_QfT0hziV_4PElf3j1DGqERl1R9UQoU0_13acmwU0yyvKstaBzykWm1adVa2aFdtfXx61TVJnpAJBNE44zC6SvO8LLawQyjJqDVvM\",
        // \"quantity\":1,\"acknowledged\":false}"

    obfuscatedAccountIdAndroid: string; // ""
    productId: string; // "test_product"
    transactionReceipt: string; // "{\"orderId\":\"GPA.3325-6870-5718-77771\",\"packageName\":\"com.j_terry.StoryLandFront\",\"productId\":\"test_product\",
        // \"purchaseTime\":1741178183947,\"purchaseState\":0,
        // \"purchaseToken\":\"ophheechdfbmbffdcccdfdof.AO-J1OyH489yJNHap6_QfT0hziV_4PElf3j1DGqERl1R9UQoU0_13acmwU0yyvKstaBzykWm1adVa2aFdtfXx61TVJnpAJBNE44zC6SvO8LLawQyjJqDVvM\",
        // \"quantity\":1,\"acknowledged\":false}"
    transactionId: string; // "GPA.3325-6870-5718-77771"
    transactionDate: number; // 1741178183947
    purchaseToken: string; // "ophheechdfbmbffdcccdfdof.AO-J1OyH489yJNHap6_QfT0hziV_4PElf3j1DGqERl1R9UQoU0_13acmwU0yyvKstaBzykWm1adVa2aFdtfXx61TVJnpAJBNE44zC6SvO8LLawQyjJqDVvM"
    productIds: Array<string>; // ["test_product"]
}

export interface GooglePlayTransactionReceipt {
    orderId: string;
    packageName: string;
    productId: string;
    purchaseTime: number,
    purchaseState: number, // 0 for purchase completed, 1 for canceled, 2 for pending
    purchaseToken: string;
    quantity: number;
    acknowledged: boolean;
}

export interface BackendResource {
    categoryInfo: CategoryInfo[];
    stories: Story[];
}

export type Category = 'animals' | 'space' | 'nature' | 'vehicles'
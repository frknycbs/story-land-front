import { useEffect, useRef, useState } from "react";
import { Product, useIAP } from "react-native-iap";
import { CategoryInfo } from "../types";
import { getCategoryInfo } from "../api/getCategoryInfo";

export const useProducts = () => {
    const {
        connected,
        products,
        getProducts,
        initConnectionError,
    } = useIAP();


    const productsRef = useRef< Product[]>(products);
    useEffect(() => {
        if (initConnectionError) {
            console.log("Init connection error:", initConnectionError);
        }
    }, [initConnectionError]);

    useEffect(() => {
        if (connected) {
            const fetchProducts = async () => {
                try {
                    const categoryInfo: CategoryInfo[] | null = await getCategoryInfo()
                    if(!categoryInfo)
                        throw("Category info cannot be fetched")

                    const categories: Array<string> = categoryInfo.map(elem => elem.categoryName)
                    await getProducts({ skus: categories });
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };

            fetchProducts();
        }
    }, [connected, getProducts]);

    useEffect(() => {
        productsRef.current = products;
    }, [products]);

    const waitForProducts = (): Promise<Product[]> =>
        new Promise((resolve) => {
            if (productsRef.current.length > 0) {
                resolve(productsRef.current);
            } else {
                const checkInterval = setInterval(() => {
                    if (productsRef.current.length > 0) {
                        clearInterval(checkInterval);
                        resolve(productsRef.current);
                    }
                }, 500); // Check every 500ms
            }
        });

    return { waitForProducts };
};

/* 
Example Product:
[
    {
        "oneTimePurchaseOfferDetails":  {
            "priceAmountMicros":"10000000",
            "formattedPrice":"TRY 10.00",
            "priceCurrencyCode":"TRY"
        },
        "name": "Test Product", 
        "productType":  "inapp",
        "description":"This is a test product",
        "title":"Test Product (com.j_terry.StoryLandFront (unreviewed))",
        "productId":"test_product",
        "price":"TRY 10.00",
        "localizedPrice":"TRY 10.00",
        "currency":"TRY"
    }
]

*/
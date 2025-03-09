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


    const productsRef = useRef< Product[] | null>(null);
    const errorFlag = useRef<boolean>(false);

    useEffect(() => {
        if (initConnectionError) {
            if(initConnectionError.toString().includes("Billing is unavailable")) {
                console.log("[useProducts] Billing is unavailable, no google play account logged in")
            }
            else console.log("[useProducts] Init connection error:", initConnectionError);
            errorFlag.current = true
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
                    console.log("[useProducts] Error fetching products:", error);
                    errorFlag.current = true
                }
            };

            fetchProducts();
        }
    }, [connected, getProducts]);

    useEffect(() => {
        if(products.length > 0)
            productsRef.current = products;
    }, [products]);

    const waitForProducts = (): Promise<Product[]> =>
        new Promise((resolve) => {
            const funcName = "[waitForProducts] ";
           // console.log(funcName + "Starting waitForAvailablePurchases");

           const checkProducts = () => {
               if(errorFlag.current) 
                   resolve([])
   
               if (productsRef.current) {
                   // console.log(funcName + "Resolving with purchases:");
                   resolve(productsRef.current);
               }
               
               setTimeout(checkProducts, 500);
           };

           checkProducts();
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
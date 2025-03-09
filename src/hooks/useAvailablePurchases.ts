import { useEffect, useRef } from "react";
import { Purchase, useIAP } from "react-native-iap";
import { useResources } from "../contexts/ResourceContext";

export const useAvailablePurchases = () => {
    const {
        connected,
        availablePurchases,
        initConnectionError,
        getAvailablePurchases,
    } = useIAP();

    const { setGooglePlayAvailable} = useResources();

    const isInitialRender = useRef(true);
    const availablePurchasesReadyRef = useRef(false);
    const availablePurchasesRef = useRef<Purchase[] | null>(null);
    const errorFlag = useRef<boolean>(false);

    useEffect(() => {
        if (initConnectionError) {
            if(initConnectionError.toString().includes("Billing is unavailable")) {
                console.log("[useAvailablePurchases] Billing is unavailable, no google play account logged in")
            }
            else console.log("[useAvailablePurchases] Init connection error:", initConnectionError);;
            
            errorFlag.current = true
        }
    }, [initConnectionError]);

    useEffect(() => {
        if (connected) {
            const fetchPurchases = async () => {
                try {
                    await getAvailablePurchases();
                    console.log("[useAvailablePurchases] getAvailablePurchases been called");
                } catch (error: any) {
                    if(error.toString().includes("Unable to auto-initialize")) {
                        console.log("[useAvailablePurchases] Auto init error, continue waiting for connection to initialize")
                        return
                    }

                    if(error.toString().includes("Billing is unavailable")) {
                        console.log("[useAvailablePurchases] Billing is unavailable, no google play account logged in")
                    }

                    else console.log("Error fetching purchases:", error);
                    errorFlag.current = true
                }
            };

            fetchPurchases();
        }
    }, [connected, getAvailablePurchases]);

    useEffect(() => {
        if (isInitialRender.current) {
            console.log("[useAvailablePurchases] Initial render purchases");
            isInitialRender.current = false;
            return;
        }

        console.log("[useAvailablePurchases] Second render, available purchases fetched");
        availablePurchasesRef.current = availablePurchases; // Update ref
        availablePurchasesReadyRef.current = true; // Update ref
        setGooglePlayAvailable(true);
    }, [availablePurchases]);

    const waitForAvailablePurchases = (): Promise<Purchase[]> =>
       
        new Promise((resolve) => {
             const funcName = "[waitForAvailablePurchases] ";
            // console.log(funcName + "Starting waitForAvailablePurchases");

            const checkPurchases = () => {
                if(errorFlag.current) 
                    resolve([])
    
                if (availablePurchasesReadyRef.current && availablePurchasesRef.current) {
                    // console.log(funcName + "Resolving with purchases:");
                    resolve(availablePurchasesRef.current);
                }
                
                setTimeout(checkPurchases, 500);
            };

            checkPurchases();
        });

    return { waitForAvailablePurchases };
};
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

    useEffect(() => {
        if (initConnectionError) {
            if(initConnectionError.toString().includes("Billing is unavailable")) {
                console.log("Billing is unavailable, no google play account logged in")
            }
            else console.log("Init connection error:", initConnectionError);;
            availablePurchasesReadyRef.current = true; // Update ref
            availablePurchasesRef.current = []
        }
    }, [initConnectionError]);

    useEffect(() => {
        if (connected) {
            const fetchPurchases = async () => {
                try {
                    await getAvailablePurchases();
                    console.log("getAvailablePurchases been called");
                } catch (error: any) {
                    if(error.toString().includes("Unable to auto-initialize")) {
                        console.log("Auto init error, continue waiting for connection to initialize")
                        return
                    }

                    if(error.toString().includes("Billing is unavailable")) {
                        console.log("Billing is unavailable, no google play account logged in")
                    }

                    else console.error("Error fetching purchases:", error);
                    availablePurchasesReadyRef.current = true; // Update ref
                    availablePurchasesRef.current = []
                }
            };

            fetchPurchases();
        }
    }, [connected, getAvailablePurchases]);

    useEffect(() => {
        if (isInitialRender.current) {
            console.log("Initial render purchases");
            isInitialRender.current = false;
            return;
        }

        console.log("Available purchases fetched:", availablePurchases);
        availablePurchasesRef.current = availablePurchases; // Update ref
        availablePurchasesReadyRef.current = true; // Update ref
        setGooglePlayAvailable(true);
    }, [availablePurchases]);

    const waitForAvailablePurchases = (): Promise<Purchase[]> =>
        new Promise((resolve) => {
            console.log("Starting waitForAvailablePurchases, ready:", availablePurchasesReadyRef.current, "current purchases:", availablePurchasesRef.current);

            const checkPurchases = () => {
                if (availablePurchasesReadyRef.current && availablePurchasesRef.current) {
                    console.log("Resolving with purchases:", availablePurchasesRef.current);
                    resolve(availablePurchasesRef.current);
                } else if (!availablePurchasesReadyRef.current) {
                    console.log("Still waiting, ready:", availablePurchasesReadyRef.current, "purchases:", availablePurchasesRef.current);
                    setTimeout(checkPurchases, 500); // Poll every 500ms
                } else {
                    console.log("Ready but no purchases, resolving empty:", availablePurchasesRef.current);
                    resolve([]); // Resolve empty if ready but no purchases
                }
            };

            checkPurchases();
        });

    return { waitForAvailablePurchases };
};
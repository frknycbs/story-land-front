/* 
// const [currentStory, setCurrentStory] = useState<Story | null>(null);

    
    const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        console.log("Loading Interstitial ad...");
        load(); // Start loading the ad

    }, [load]); // Load the ad only once when component mounts

    useEffect(() => {
        if (isClosed) {
            // Action after the ad is closed
            console.log("Interstitial Ad closed, switching to Story")
            if (currentStory)
                navigation.navigate('Story', { story: currentStory });
        }
    }, [isClosed, navigation]);

    
 
    if (isLoaded) {
        console.log("Interstitial Ad loaded, showing...");
        setCurrentStory(story);
        show();
    }

    else {
        console.log("Interstitial Ad not loaded yet -- switching to Story");
        navigation.navigate('Story', { story: story });
    }
                                    
*/
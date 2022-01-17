import * as Font from 'expo-font';
import {FontDisplay} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          GothamBook: {uri:require('../assets/fonts/GothamBook.ttf'), display:FontDisplay.SWAP},
          GothamMedium: {uri:require('../assets/fonts/GothamMedium.ttf'), display:FontDisplay.SWAP},
          GothamBold: {uri:require('../assets/fonts/GothamBold.ttf'), display:FontDisplay.SWAP},
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

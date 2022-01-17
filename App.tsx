import React, {Component, useState} from "react";
import store from "./store/store";
import {Provider} from 'react-redux';
import useCachedResources from './hooks/useCachedResources';
import Routes from "./navigation/Routes";
import colors from "./assets/colors/colors";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

        <Provider store={store}>
          <StatusBar barStyle="light-content" backgroundColor={colors.primaryThemeColor}/>
          <SafeAreaView style={{flex: 1, marginTop: 30}}>
            <Routes/>
          </SafeAreaView>
        </Provider>
    )
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
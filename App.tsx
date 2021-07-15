import React, {Component, useState} from "react";
import store from "./store/store";
import {Provider} from 'react-redux';
import useCachedResources from './hooks/useCachedResources';
import Routes from "./navigation/Routes";
import colors from "./assets/colors/colors";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

        <Provider store={store}>
          <StatusBar barStyle="light-content" backgroundColor={colors.primary_theme_color}/>
          <SafeAreaView style={{flex: 1, marginTop: 30}}>
            <Routes/>
          </SafeAreaView>
        </Provider>
    )
  }
}
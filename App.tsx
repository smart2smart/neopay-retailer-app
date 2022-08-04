import React, { Component, useState } from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import useCachedResources from "./hooks/useCachedResources";
import Routes from "./navigation/Routes";
import colors from "./assets/colors/colors";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://75d529fb9c074630a7497937f0250abc@o1339126.ingest.sentry.io/6611131",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  enableNative: false,
  enableInExpoDevelopment: false,
  enableAutoPerformanceTracking: true,
  enableOutOfMemoryTracking: true,
  debug: true,
});
export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primaryThemeColor}
        />
        <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
          <Routes />
        </SafeAreaView>
      </Provider>
    );
  }
}

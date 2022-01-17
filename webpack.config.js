const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    // Set by expo-cli during `expo build:web`
    const isEnvProduction = env.mode === "production";
    // Customize the config before returning it.
    config.module.rules.push(
        // This would match almost any react-native module
        {
            test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
            include: /node_modules/,
            exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
            loader: 'babel-loader'
        })
    config.module.rules.push(
        // This would match ui-kitten
        {
            test: /@?(react-native-otp-input).*\.(ts|js)x?$/,
            loader: 'babel-loader'
        })
    // config.resolve.alias['react-native'] =  'react-native-web';
    config.resolve.alias['react-native-maps'] =  'react-native-web-maps';

    if (isEnvProduction) {
        config.plugins.push(
            // Generate a service worker script that will precache, and keep up to date,
            // the HTML & assets that are part of the webpack build.
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc: path.resolve(__dirname, "./service-worker.js"),
                dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
                exclude: [
                    /\.map$/,
                    /asset-manifest\.json$/,
                    /LICENSE/,
                    /\.js\.gz$/,
                    // Exclude all apple touch and chrome images because they're cached locally after the PWA is added.
                    /(apple-touch-startup-image|chrome-icon|apple-touch-icon).*\.png$/,
                ],
                // Bump up the default maximum size (2mb) that's precached,
                // to make lazy-loading failure scenarios less likely.
                // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            })
        );
    }
    return config;
};

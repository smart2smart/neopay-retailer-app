module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            "@commonStyles": "./styles/commonStyles",
            "@texts": "./styles/texts",
            "@colors": "./assets/colors/colors",
            "@api": "./api/api",
            "@authenticatedGetRequest": "./api/authenticatedGetRequest",
            "@authenticatedPostRequest": "./api/authenticatedPostRequest",
            "@postRequest": "./api/postRequest",
            "@getRequest": "./api/getRequest",
            "@checkToken": "./api/checkToken",
            "@screens": "./screens",
            "@commons": "./commons",
            "@headers": "./headers",
            "@actions": "./actions/actions",
            "@utils": "./utils/",
            "@modals": "./modals/",
            "@Buttons": "./buttons/Buttons",
          },
        },
      ],
    ],
  };
};

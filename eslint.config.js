const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: ["react-native"],
    ignores: ["dist/*"],
    rules: {
      "react-native/no-unused-styles": "error",
    },
  },
]);

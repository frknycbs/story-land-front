// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  mangle: false, // Prevents variable/function renaming
  keep_classnames: true,
  keep_fnames: true,
};

module.exports = config;

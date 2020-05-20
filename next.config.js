const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.node = {
      fs: 'empty'
    }


    config.plugins.push(new webpack.DefinePlugin(env));

    return config
  }
};
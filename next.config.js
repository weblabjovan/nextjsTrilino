const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const webpack = require("webpack");
require("dotenv").config();

module.exports = withCSS(withSass({
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
}))

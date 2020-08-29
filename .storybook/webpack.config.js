// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
require('../node_scripts/register');
require('babel-polyfill');
const path = require('path');
const config = require('../app.config').default;

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [{
      test: [/.jsx?$/, /.js?$/],
      exclude: /(node_modules)/,
    },{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader'
      }],
      include: [ config.paths.client, path.resolve(__dirname, '../node_modules') ]
    },{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
      loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
    }],
  },
  node: {
    fs: 'empty',
    module: "empty",
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    crypto : "empty"
  },
  entry: {
    app: ['babel-polyfill', path.join(config.paths.client, 'app-container')],
    healthcheck: ['babel-polyfill', path.join(config.paths.client, 'pages', 'health-check')],
    login: ['babel-polyfill', path.join(config.paths.client, 'pages', 'login')]
  },
  resolveLoader: { modules: ['node_modules'] },
  resolve: {
    modules: [path.resolve(__dirname, '../node_modules')],
    // Webpack tries to append these extensions when you require(moduleName)
    extensions: ['.json', '.js', '.jsx', '.css'],
    aliasFields: ['browser'],
    alias: {
      '@': path.join(__dirname, '../'),
      api: path.join(__dirname, '../api'),
      web: path.join(__dirname, '../web'),
      node_scripts: path.join(__dirname, '../node_scripts'),
      'app.config': path.join(__dirname, '../app.config.js'),
      'env.config': path.join(__dirname, '../env.config.js'),
      joi: 'joi-full'
    }
  },
};

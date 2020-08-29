// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import appModulePath from 'app-module-path';
import dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin'; // TODO: update to 4.0 when it becomes available to clear deprecation warnings for tappable
import EventHooksPlugin from 'event-hooks-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'; // eslint-disable-line no-unused-vars
import UnusedWebpackPlugin from 'unused-webpack-plugin';
import figlet from 'figlet';
import config from './app.config';
appModulePath.addPath(__dirname);

dotenv.config();

const APP_ENTRY = ['babel-polyfill', path.join(config.paths.client, 'entries', 'app-container')];

const logger = config.logger.child({ component: path.basename(__filename) });

const JS_JSX = /\.(js|jsx)$/;
const BABEL = 'babel-loader'; // We use Babel to transpile ES6/JSX into ES5. See .babelrc for additional rules.
const CSS_LOADER = {
  test: /\.css$/,
  use: [{
    loader: 'css-loader'
  }],
  include: [ config.paths.client, config.paths.assets, path.resolve(__dirname, 'node_modules') ]
};

if (process.env.NODE_ENV === 'production') {
  CSS_LOADER.use.unshift({ loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } });
} else {
  CSS_LOADER.use.unshift({ loader: 'style-loader' });
}

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
});

const SASS_LOADER = {
  test: /\.scss$/,
  use: extractSass.extract({
    use: [{
      loader: 'css-loader'
    }, {
      loader: 'sass-loader'
    }],
    // use style-loader in development
    fallback: 'style-loader'
  }),
  include: config.paths.client
};
const URL_LOADER = {
  test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
  loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
};

const baseConfig = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production', // production unless explicitly development
  entry: {
    app: APP_ENTRY,
    healthcheck: ['babel-polyfill', path.join(config.paths.client, 'entries', 'health-check')],
    login: ['babel-polyfill', path.join(config.paths.client, 'entries', 'login')]
  },
  resolveLoader: { modules: ['node_modules'] },
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
    // Webpack tries to append these extensions when you require(moduleName)
    extensions: ['.json', '.js', '.jsx', '.css'],
    aliasFields: ['browser'],
    alias: {
      '@': path.join(__dirname, './'),
      api: path.join(__dirname, './api'),
      web: path.join(__dirname, './web'),
      env: path.join(__dirname, './env'),
      node_scripts: path.join(__dirname, './node_scripts'),
      'app.config': path.join(__dirname, './app.config.js'),
      'agilysys.lib': path.join(__dirname, './agilysys.lib/index.js'),
      'env.config': path.join(__dirname, './env.config.js'),
      joi: 'joi-full'
    }
  },
  output: {
    publicPath: config.webPaths.build.substr(1), // Expose bundles in this web directory to plugins like assets for use in the server-views.
    filename: config.webpack.outputFilename, // Bundle filename pattern
    path: config.paths.build // Put bundle files in this directory (Note: dev server does not generate bundle files in the fs, just in mem)
  },
  node: {
    fs: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    crypto: 'empty'
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({ // makes globals defined here available in the webpack bundle(s).
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ENVIRONMENT: JSON.stringify(process.env.ENVIRONMENT)
      }
    }),
    new AssetsWebpackPlugin({ // generate an assets json that describes the generated bundles (i.e., with cache-busting hashes)
      filename: config.webpack.assetsFileName,
      path: config.webpack.assetsPath,
      prettyPrint: false
    }),
    new EventHooksPlugin({
      'done': () => {
        if (process.env.NODE_ENV === 'production') {
          figlet.text(`WebPack - Built`, {
            font: 'Slant'
          }, (err, data) => {
            console.log(chalk.green(data, err));
            logger.info(`WebPack - Built`);
          });
        }
      },
      'emit': () => {
        // Hot Message
        if (process.env.NODE_ENV === 'development') {
          figlet.text(`WebPack - HOT`, {
            font: 'Slant'
          }, (err, data) => {
            console.log(chalk.green(data, err));
            logger.info(`WebPack - Built`);
          });
        }
      }
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          minSize: 0,
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};

const module = {
  rules: [
    URL_LOADER,
    CSS_LOADER,
    SASS_LOADER,
    {
      test: JS_JSX,
      exclude: [/(node_modules)/, /joi-full/],
      use: [{
        loader: BABEL,
        options: {
          plugins: ['transform-runtime']
        }
      }],
      include: [config.paths.webViews, path.join(config.paths.root, 'app.config')]
    }
  ]
};

const devServer = {
  contentBase: config.paths.build,
  hot: true,
  port: 3000,
  overlay: true
};

const devPlugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin({
    multiStep: false
  }),
  new UnusedWebpackPlugin({
    directories: [path.join(__dirname, 'web', 'client')],
    exclude: ['*.test.js', '*__snapshots__*', '*.stories.js', '*.test.jsx', '.DS_Store'],
    root: __dirname
  })
];

const prodPlugins = [
  // new BundleAnalyzerPlugin(), // uncomment this line to run and open the bundle analyzer on yarn build.
  new webpack.optimize.OccurrenceOrderPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name]-[contentHash].css'
  })
];

const devConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    hotUpdateChunkFilename: '[hash].hot-update.js'
  },
  module,
  devServer,
  plugins: [...baseConfig.plugins, ...devPlugins],
  devtool: 'inline-cheap-module-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    ignored: /node_modules/,
    poll: false
  }
};

const prodConfig = {
  ...baseConfig,
  module,
  performance: {
    hints: false
  },
  plugins: [...baseConfig.plugins, ...prodPlugins],
  optimization: {
    ...baseConfig.optimization,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          ie8: false,
          safari10: false
        }
      })
    ]
  }
};

export default (process.env.NODE_ENV === 'development' ? devConfig : prodConfig);

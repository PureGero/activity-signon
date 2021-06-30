const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const jsToScss = require('./utils/jsToScss.js');
const fs = require('fs');

fs.rmdirSync(__dirname + '/dist', { recursive: true });

const mode = 'development';

const publicPath = 'https://cdn.activitysignon.com/';

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

const config = {
  commitHash,
  env: process.env,
  ...require('./config')
};

const modules = {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            additionalData: jsToScss(config)
          }
        }
      ]
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    }
  ]
};

const indexWebpack = {
  mode,
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: publicPath,
    filename: 'bundle-[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/assets/favicon.ico',
      templateParameters: config
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle-[hash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/static' }
      ]
    })
  ],
  module: modules
};

const signonWebpack = {
  mode,
  entry: __dirname + '/src/signon/signon.js',
  output: {
    path: __dirname + '/dist/signon',
    publicPath: publicPath + 'signon/',
    filename: 'bundle-[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/signon/signon.html',
      favicon: 'src/assets/favicon.ico',
      templateParameters: config
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle-[hash].css'
    })
  ],
  module: modules
};

const adminWebpack = {
  mode,
  entry: __dirname + '/src/admin/admin.js',
  output: {
    path: __dirname + '/dist/admin',
    publicPath: publicPath + 'admin/',
    filename: 'bundle-[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/admin/admin.html',
      favicon: 'src/assets/favicon.ico',
      templateParameters: config
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle-[hash].css'
    })
  ],
  module: modules
};

const notFoundWebpack = {
  mode,
  entry: __dirname + '/src/404.js',
  output: {
    path: __dirname + '/dist',
    publicPath: publicPath,
    filename: '404.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: 'src/404.html',
      templateParameters: config
    })
  ]
};

module.exports = [
  indexWebpack,
  adminWebpack,
  notFoundWebpack,
  signonWebpack
];
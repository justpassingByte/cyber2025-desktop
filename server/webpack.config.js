const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Configuration for the main process
const mainConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main/main.ts',
  target: 'electron-main',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      "path": false,
      "fs": false,
      "os": false
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main'),
  },
  ignoreWarnings: [/^((?!critical).)*$/],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^((mssql)|(sqlite3)|(pg-native)|(oracle)|(oracledb)|(pg-query-stream))$/
    })
  ],
};

// Configuration for the renderer process
const rendererConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      "path": false,
      "fs": false,
      "os": false
    }
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
  ],
  ignoreWarnings: [/^((?!critical).)*$/],
};

// Export both configurations as an array
module.exports = [mainConfig, rendererConfig]; 
// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    chunkFilename: '[name].chunk.js', 
    chunkLoadingGlobal: 'webpackJsonp' // Important for lazy loading
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

};

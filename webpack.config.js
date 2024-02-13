// webpack.config.js

const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    lazy: './src/app/modules/lazy/lazy.module.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js', 
    chunkLoadingGlobal: 'webpackJsonp' // Important for lazy loading
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // put external deps in vendor bundle
            if (module.context.indexOf('node_modules') !== -1) {
              return 'vendor';
            }
          }
        }
      }
    }
  },
};

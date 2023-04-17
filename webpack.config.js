const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
      rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.xml$/,
        use: [{
          loader: 'xml-loader' // will load all .xml files with xml-loader by default
        }],
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'NameGenerator'
  },
  externalsType: 'window',
  externals: {
    lodash: '_',
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};
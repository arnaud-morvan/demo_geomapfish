const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const destDir = '/etc/static-ngeo/';

const babelPresets = [[require.resolve('@babel/preset-env'), {
  targets: {
    browsers: ['last 2 versions', 'Firefox ESR', 'ie 11'],
  },
  modules: false,
  loose: true
}]];

module.exports = (env, argv) => {
  const library = argv.library ? argv.library : 'demo';
  return {
    entry: path.resolve(__dirname, 'demo_geoportal/static-ngeo/api/index.js'),
    devtool: 'source-map',
    mode: 'production',
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: babelPresets,
            babelrc: false,
            comments: false,
            plugins: [
              require.resolve('@babel/plugin-syntax-object-rest-spread'),
              require.resolve('@babel/plugin-transform-spread'),
              require.resolve('@camptocamp/babel-plugin-angularjs-annotate'),
            ]
          }
        }
      }]
    },
    output: {
      filename: 'api.js',
      path: destDir,
      libraryTarget: 'umd',
      globalObject: 'this',
      libraryExport: 'default',
      library: library
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            compress: false
          }
        })
      ]
    },
    resolve: {
      modules: [
        '/usr/lib/node_modules',
        '/usr/lib/node_modules/ol/node_modules',
        '/usr/lib/node_modules/proj4/node_modules',
      ],
      alias: {
        api: '/usr/lib/node_modules/ngeo/api/src',
      }
    },
    resolveLoader: {
      modules: ['/usr/lib/node_modules'],
    }
  };
};

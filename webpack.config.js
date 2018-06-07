const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./aurelia_project/aurelia.json');
const { AureliaPlugin, ModuleDependenciesPlugin} = require('aurelia-webpack-plugin');
const { optimize: { CommonsChunkPlugin, UglifyJsPlugin}, ProvidePlugin} = require('webpack');
const { TsConfigPathsPlugin, CheckerPlugin} = require('awesome-typescript-loader');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) => condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const title = project.name;
const outDir = path.resolve(__dirname, project.platform.output);
const srcDir = path.resolve(__dirname, 'src');
const resourcesDir = path.resolve(srcDir, 'resources');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '';

const cssRules = [{ loader: 'css-loader'}, ];

module.exports = ({ production, server, extractCss, coverage, cordova} = {}) => {
  return [{
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [srcDir, resourcesDir, 'node_modules'],
    },
    entry: {
      app: ['aurelia-bootstrapper'],
      vendor: ['bluebird','framework7'],
    },
    output: {
      path: outDir,
      publicPath: baseUrl,
      filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
      chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
    },
    devServer: {
      contentBase: outDir,
      historyApiFallback: true
    },
    module: {
      rules: [
        { test: /\.css$/i, issuer: [{not: [{test: /\.html$/i}]}],
          use: extractCss ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssRules
          }) : ['style-loader', ...cssRules],
        },
        { test: /\.css$/i, issuer: [{test: /\.html$/i}], use: cssRules},
        { test: /\.html$/i, loader: 'html-loader'},
        { test: /\.ts$/i, loader: 'awesome-typescript-loader', exclude: nodeModulesDir},
        { test: /\.json$/i, loader: 'json-loader'},
        { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/,loader: 'expose-loader?Promise' },
        { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
        { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' }},
        { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff'}},
        // load these fonts normally, as files:
        { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader'},
        ...when(coverage, {
          test: /\.[jt]s$/i,
          loader: 'istanbul-instrumenter-loader',
          include: srcDir,
          exclude: [/\.{spec,test}\.[jt]s$/i],
          enforce: 'post',
          options: {
            esModules: true
          },
        })
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ IS_CORDOVA: JSON.stringify(cordova)}),
      new AureliaPlugin(),
      new ProvidePlugin({'Promise': 'bluebird'}),
      new ModuleDependenciesPlugin({'aurelia-testing': ['./compile-spy', './view-spy']}),
      new TsConfigPathsPlugin(),
      new CheckerPlugin(),
      new HtmlWebpackPlugin({ template: 'index.ejs', metadata: {title, server, baseUrl, cordova}}),
      new CommonsChunkPlugin({ name: ['common']}),
      ...when(extractCss, new ExtractTextPlugin({
        filename: production ? '[contenthash].css' : '[id].css',
        allChunks: true
      })),
      ...when(production, new CopyWebpackPlugin([{
        from: 'static/favicon.ico',
        to: 'favicon.ico'
      }])),
      ...when(production, new UglifyJsPlugin({
        sourceMap: true
      }))
    ]
  }];
}

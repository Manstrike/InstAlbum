var path = require('path');
var webpack = require('webpack');

module.exports =  {
     mode: 'development',
     target: 'node',
     entry: {
        albumView: './src/frontend/AlbumView.js',
        createForm: './src/frontend/CreateForm.js',
    },
     output: {
         path: path.resolve(__dirname, 'public/js'),
         filename: '[name].bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 exclude: /(node_modules)/,
                 loader: 'babel-loader',
                 query: {
                     presets: [
                         '@babel/preset-env',
                        ]
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'inline-source-map'
 };
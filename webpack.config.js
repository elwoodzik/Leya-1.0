let webpack = require('webpack');

const LiveReloadPlugin = require('webpack-livereload-plugin');
module.exports = {
    entry: {
        "bundle": "./src/index.js",
        "bundle.min": "./src/index.js",
        "worker": "./src/components/Pages/test.js",
    },
    output: {
        path: __dirname + '/public/javascripts',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            sourceMap: false,
            debug: false
        })
    ]
};

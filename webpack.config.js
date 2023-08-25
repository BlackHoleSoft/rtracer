const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src', 'main.ts'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                exclude: /(node_modules|libs)/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', 'json', '.ts', '.tsx'],
        modules: [`${__dirname}/src`, 'node_modules'],
    },
    output: {
        path: path.join(__dirname, 'bundle'),
        filename: 'scripts.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            cache: false,
        }),
    ],
};

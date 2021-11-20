const path = require('path');
const webpack = require('webpack')

module.exports = {
    entry: './src/unleash.ts',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'unleash.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'module',
    },
    mode: 'production',
    experiments: {
        outputModule: true,
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]
};
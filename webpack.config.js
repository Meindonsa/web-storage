const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'WebStorageService',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        'crypto-js': 'crypto-js',
        'lz-string': 'lz-string'
    },
    mode: 'production',
    devtool: 'source-map'
};

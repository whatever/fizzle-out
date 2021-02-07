const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
        library: "yikes",
        libraryTarget: "var",
        path: path.join(__dirname, "dist"),
        filename: "build.js"
    },
    externals: {
        three: "THREE"
    },
    devServer: {
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ["@babel/transform-runtime"]
                }
            }
        ]
    },
    experiments: {
        syncWebAssembly: true,
        topLevelAwait: true,
        asyncWebAssembly: true,
    },
};
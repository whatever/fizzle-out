const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        /*
        fallback: {
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
        },
        */
    },
    plugins: [
        /*
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
      */
    ],
};
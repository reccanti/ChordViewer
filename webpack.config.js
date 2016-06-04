var webpack = require('webpack');
module.exports = {
    output: {
        path: './dist',
        filename: 'chordViewer.min.js',
        libraryTarget: 'umd',
        library: 'ChordViewer'
    },
    entry: [
        './src/index.js'
    ],
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
            },
        }),
    ],
    module: {
        loaders: [
            {
                test: require.resolve('snapsvg'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ],
    }
};
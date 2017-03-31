/**
 * Created by qiyc on 2017/2/6.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');//npm install autoprefixer --save-dev 自动加css前缀
module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: {
        "core":__dirname + "/doc/docs/main.js"
    },
    output: {
        path: __dirname + "/doc/js",
        filename:  "doc.min.js"
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback:"style-loader",use:"css-loader"
                })//添加对样式表的处理
            },
            {test: /\.html$/, loader: 'raw-loader'}
        ]
    },
    externals: {
        jquery: 'window.$'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),//压缩代码插件
        new ExtractTextPlugin({
            filename:"qtopo.css",allChunks: true
        })
    ]
};
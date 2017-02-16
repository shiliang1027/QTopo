/**
 * Created by qiyc on 2017/2/6.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');//npm install autoprefixer --save-dev 自动加css前缀
var path = require("path");
module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: __dirname + "/develop/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public/qtopo",//打包后的文件存放的地方
        filename: "qtopo.min.js"//打包后输出文件的文件名
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader:"style-loader",loader:"css-loader"
                })//添加对样式表的处理
            },
            {test: /\.html$/, loader: 'raw'}
        ]
    },
    externals: {
        jquery: 'window.$'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),//压缩代码插件
        new ExtractTextPlugin({
            filename:"qtopo.min.css",allChunks: true
        }),//合并并压缩输出到目录
    ]
};
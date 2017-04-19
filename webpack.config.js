/**
 * Created by qiyc on 2017/2/6.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');//npm install autoprefixer --save-dev 自动加css前缀
module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: {
        "core":__dirname + "/develop/main.js",//入口文件
        "component":__dirname + "/develop/component/component.js",
        "iposs":__dirname+"/iposs/main.js",
        "jtopo2":__dirname+"/develop/core/jtopo/index.js"
    },
    output: {
        path: __dirname + "/topo_iposs/qtopo",//打包后的文件存放的地方
        //filename:  "[name]-[hash].bundle.js"//打包后输出文件的文件名
        filename:  "qtopo.[name].min.js"
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
        })//合并并压缩输出到目录
        //new webpack.optimize.CommonsChunkPlugin(
        //{
        //    name: 'iposs',
        //    chunks: ['iposs'],
        //    filename: "../../topo_iposs/qtopo/iposs.min.js"
        //}
        //)
    ]
};
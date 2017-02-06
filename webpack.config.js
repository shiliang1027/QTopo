/**
 * Created by qiyc on 2017/2/6.
 */
module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry:  __dirname + "/core/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname,//打包后的文件存放的地方
        filename: "topo.bundle.js"//打包后输出文件的文件名
    }
};
module.exports = {
//扫描的文件路径
    paths: ['develop/'],

//文档页面输出路径
    outdir: 'doc/',

//项目信息配置
    project: {

//项目名称
        name: 'SmartDoc',

//项目描述，可以配置html，会生成到document主页
        description: '<h2>SmartDoc</h2> <p>Javascript Document builder base on YUIDoc.</p>',

//版本信息
        version: '1.1.0'

//地址信息
//        url: 'https://github.com/zhh77/smartjs',
////logo地址
//        logo: 'https://github.com/zhh77/logo.png',
////导航信息
//        navs: [{
//            name: "Home",
//            url: "https://github.com/zhh77/smartjs"
//        }, {
//            name: "Document",
//            url: ""
//        }, {
//            name: "About",
//            url: "https://github.com/zhh77/smartjs"
//        }]
    }

//demo展示页面配置；需要加载的资源； 资源只能是css和js文件
//    demo: {
//
////外部资源链接
//        link: ['http://code.jquery.com/jquery-1.11.0.min.js'],
//
////文件复制路径; 将目下的资源复制到doc生成目录中，并在deom页面引用
//        paths: ['input/ui/uicode.js', 'input/'],
//
////是否开启在code编辑器中的自动完成功能(会将link和paths的引入加入)；默认开启；
//        autoComplete: true
//    },

//自定义主题路径
//    themedir: 'theme/',

//自定义helpers
//    helpers: ["theme/helpers/helpers.js"]
};
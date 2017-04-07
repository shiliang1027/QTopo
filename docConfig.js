module.exports = {
    //扫描的文件路径
    paths: ['develop/'],

    //文档页面输出路径
    outdir: 'docs/',

    //项目信息配置
    project: {

        //项目名称
        name: 'QTopo',

        //项目描述，可以配置html，会生成到document主页
        description: '<h2>QTopo</h2> <p>一种topo图绘制工具，基于JTopo封装。遗憾的是JTopo已经2年多没更新了!!</p><h5>入口请参阅<a href="./classes/QTopo.html">QTopo</a></h5>' +
        '<p>使用说明: ' +
        '<h5>1.引入js和css文件</h5> ' +
        '<h5>2.调用QTopo.init函数(<a href="./classes/QTopo.html">api</a>),传入一个设置了高宽的dom元素用以生成topo图，返回topo对象</h5>' +
        '<h5>3.topo对象(<a href="./classes/QTopo.instance.html">instance</a>)调用函数setOption绘制topo图</h5>' +
        '<h5>4.var json=topo.toJson()导出绘制参数用以保存</h5>' +
        '<h5>5.下次使用可直接用作QTopo初始化参数以及绘图数据,如var topo=QTopo.init(dom,json.init),topo.setOption(json.option)即可还原topo图</h5></ht></p>',

        //版本信息
        version: '1.0',

        //地址信息
        url: 'https://github.com/hai3460377/QTopo',
        //logo地址
        logo : './logo.png',
        //导航信息
        navs: [{
            name: "下载",
            url: "./download/qtopo.zip"
        }]
    }
};
/**
 * Created by qiyc on 2017/2/6.
 */
window.$ = window.jQuery = require('./lib/jquery/jquery.min.js');
require('./lib/jquery-nicescroll/jquery.nicescroll.min.js');
require("./lib/jtopo/jtopo-min.js");
//模块
window.QTopo = {};
window.QTopo.util = require('./component/util.js');
var Scene=require('./component/Scene.js');
window.QTopo.init = function (canvas, config) {
    this.config=config;
    var stage = new JTopo.Stage(canvas);
    var scene = new Scene(stage);
    this.scene=scene;
    scene.set({
        background:config.background
    });
    scene.createNode({
        type:"text",
        position:[200,200],
        font:{
            size:30
        }
    });
    var normal=scene.createNode({
        type:"normal",
        position:[200,100],
        font:{
            size:30
        }
    });
    console.info(scene);
    normal.set({
        position:[500,200]
    });
};
/**
 * Created by qiyc on 2017/2/6.
 */
window.$ = window.jQuery = require('./lib/jquery/jquery.min.js');
require('./lib/jquery-nicescroll/jquery.nicescroll.min.js');
require("./lib/jtopo/jtopo-min.js");
//模块
window.QTopo = {};
window.QTopo.util = require('./component/util.js');
var Scene=require('./component/element/Scene.js');
window.QTopo.init = function (canvas, config) {
    this.config=config;
    var stage = new JTopo.Stage(canvas);
    var scene = new Scene(stage);
    this.scene=scene;
    scene.set({
        background:config.background
    });
    scene.on("dbclick",function(e){
        console.info(e.target.qtopo);
    });
    var text=scene.createNode({
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
        },
        size:[100,100]
    });
    var normal2=scene.createNode({
        type:"normal",
        position:[200,100],
        font:{
            size:30
        }
    });
    console.info(scene);
    var link=scene.createLink({
        type:"flexional",
        start:text,
        end:normal
    });
    normal.set({
        position:[500,200]
    });
    setTimeout(function(){
        text.set({
            text:"aaaa"
        });
        normal.set({
            name:"aaa",
            textPosition:"Hidden"
        });
    },2000);
    setTimeout(function(){
        normal.set({
            name:"bbb",
            textPosition:"Bottom_Center"
        });
    },3000);

};
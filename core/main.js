/**
 * Created by qiyc on 2017/2/6.
 */
require('./lib/jquery-nicescroll/jquery.nicescroll.min.js');
require("./lib/jtopo/jtopo-min.js");
//模块
window.QTopo = {};
window.QTopo.util = require('./util.js');
var Scene=require('./Scene.js');
window.QTopo.init = function (canvas, config) {
    this.config=config;
    var QtopoInstance={};
    var stage = new JTopo.Stage(canvas);
    var scene = new Scene(stage,{
        background:config.background||""
    });
    QtopoInstance.scene=scene;
    QtopoInstance.setOption=setOption;
    test(scene);
    return QtopoInstance;

};
function setOption(option){
    var scene=this.scene;
    createNode(option.node||{});
    createContainer(option.container||{});
    createLink(option.link||{});

    function createNode(config){
        if($.isArray(config.data)){
            $.each(config.data,function(i,v){
                var node=scene.createNode(v);
                if($.isArray(nodeConfig.exprop)){
                    $.each(nodeConfig.exprop,function(j,key){
                        node[key]=v[key];
                    });
                }
            });
        }
    }
    function createLink(config){
        var path=config.path;
        if($.isArray(path)){
            var findStart;
            var findEnd;
            //确定搜索条件,起始点条件可不同
            path.length==1?findEnd=findStart=path[0]: findStart=path[0],findEnd=path[1];
            if($.isArray(config.data)){
                $.each(config.data,function(i,v) {
                    var start=scene.find(findStart+"="+ v.start)[0];
                    var end=scene.find(findEnd+"="+ v.end)[0];
                    if(start&&end){
                        v.start=start;
                        v.end=end;
                        scene.createLink(v);
                    }else{
                        console.error("some link path invalid",v);
                    }
                });
            }
        }else{
            console.error("can not draw link,need config 'path' and 'path' is Array");
        }
    }
    function createContainer(config){

    }
}
function test(scene){
    scene.on("dbclick",function(target,e){
        console.info(target);
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
        image:"img/mo/wlan_4.png",
        name:"test1",
        size:[100,100]
    });
    normal.id="avsa...";
    var normal2=scene.createNode({
        type:"normal",
        position:[200,100],
        font:{
            size:30
        }
    });
    normal2.id="avsa...";
    var group=scene.createContainer({
        name:"test Group",
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
    link.id="avsa...";
    normal.set({
        position:[500,200]
    });
    setTimeout(function(){
        text.set({
            text:"aaaa"
        });
        normal.set({
            name:"aaa",
            textPosition:"hide"
        });
        group.add(normal);
    },2000);
    setTimeout(function(){
        normal.set({
            name:"bbb",
            textPosition:"left"
        });
        group.add(text);
    },3000);
    setTimeout(function(){
        normal.set({
            name:"ccc",
            textPosition:"top"
        });
        group.remove(text);
        group.add(normal2);
    },4000);
}
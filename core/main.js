/**
 * Created by qiyc on 2017/2/6.
 */
require("./jtopo/jtopo-min.js");
//模块
window.QTopo = {};
window.QTopo.instance=[];
window.QTopo.util = require('./util.js');
var Scene = require('./Scene.js');
window.QTopo.init = function (canvas, config) {
    var QtopoInstance = {};
    this.instance.push(QtopoInstance);
    var stage = new JTopo.Stage(canvas);
    var scene = new Scene(stage,config);
    QtopoInstance.scene = scene;
    QtopoInstance.setOption = setOption;
    //test(scene);
    scene.on("dbclick", function (target, e) {
        console.info(target);
    });
    return QtopoInstance;
};
function setOption(option,clear) {
    var scene = this.scene;
    if(clear){
        scene.clear();
    }
    createNode(scene, option.node);
    createContainer(scene, option.container);
    createLink(scene, option.link);
    drawAlarm(scene,option.alarm);
    scene.center();
}
function test(scene) {
    var text = scene.createNode({
        type: "text",
        position: [200, 200],
        font: {
            size: 30
        }
    });
    var normal = scene.createNode({
        type: "normal",
        position: [200, 100],
        font: {
            size: 30
        },
        image: "img/mo/wlan_4.png",
        name: "test1",
        size: [100, 100]
    });
    normal.id = "avsa...";
    var normal2 = scene.createNode({
        type: "normal",
        position: [200, 100],
        font: {
            size: 30
        }
    });
    normal2.id = "avsa...";
    var group = scene.createContainer({
        name: "test Group",
        font: {
            size: 30
        }
    });
    var link = scene.createLink({
        type: "flexional",
        start: text,
        end: normal
    });
    link.id = "avsa...";
    normal.set({
        position: [500, 200]
    });
    setTimeout(function () {
        text.set({
            text: "aaaa"
        });
        normal.set({
            name: "aaa",
            textPosition: "hide"
        });
        group.add(normal);
    }, 2000);
    setTimeout(function () {
        normal.set({
            name: "bbb",
            textPosition: "left"
        });
        group.add(text);
    }, 3000);
    setTimeout(function () {
        normal.set({
            name: "ccc",
            textPosition: "top"
        });
        group.remove(text);
        group.add(normal2);
    }, 4000);
}
function createNode(scene, config) {
    if (config) {
        if ($.isArray(config.data)) {
            $.each(config.data, function (i, v) {
                var node = scene.createNode(v);
                //额外属性添加
                if ($.isArray(config.exprop)) {
                    $.each(config.exprop, function (j, key) {
                        if( v[key]){
                            node[key] = v[key];
                        }
                    });
                }
            });
        }
    }
}
function createContainer(scene, config) {
    if (config) {
        var findChild;
        if (config.children) {
            findChild = config.children;
        }
        if ($.isArray(config.data)) {
            //开始构造分组
            $.each(config.data, function (i, cData) {
                //无论是否有子元素，分组先创造出来
                var container = scene.createContainer(cData);
                //额外属性添加
                if ($.isArray(config.exprop)) {
                    $.each(config.exprop, function (j, key) {
                        if(cData[key]) {
                            container[key] = cData[key];
                        }
                    });
                }
                //确定查找子元素的标记
                var findChild_exact = findChild;
                if (cData.children) {
                    findChild_exact = cData.children;
                }
                //查找子元素并塞入
                if (findChild_exact) {
                    $.each(cData.data, function (j, children) {
                        var child = scene.find(findChild_exact + "=" + children);
                        if (child && child.length > 0) {
                            $.each(child, function (m, one) {
                                container.add(one);
                            });
                        } else {
                            console.error("some child not found : " + j, findChild_exact + "=" + children);
                        }
                    });
                } else {
                    console.error("can't find children,need config children");
                }
            });
        }
    }
}
function createLink(scene, config) {
    if (config) {
        var path = config.path;
        if ($.isArray(path) && path.length > 0) {
            var findStart;
            var findEnd;
            //path为数组，0为起点条件1为终点条件,确定搜索条件,起始点条件可不同
            if (path.length == 1) {
                findEnd = path[0];
                findStart = findEnd;
            } else {
                findStart = path[0];
                findEnd = path[1];
            }
            if ($.isArray(config.data)) {
                $.each(config.data, function (i, v) {
                    var link;
                    //根据确定的条件进行搜索
                    var start = scene.find(findStart + "=" + v.start)[0];
                    var end = scene.find(findEnd + "=" + v.end)[0];
                    if (start && end) {
                        v.start = start;
                        v.end = end;
                        link = scene.createLink(v);
                        //额外属性添加
                        if (link && $.isArray(config.exprop)) {
                            $.each(config.exprop, function (j, key) {
                                if(v[key]){
                                    link[key] = v[key];
                                }
                            });
                        }
                    } else {
                        console.error("some link path invalid : "+ i, v);
                        if(!start){
                            console.error("start not found : ",v.start);
                        }
                        if(!end){
                            console.error("end not found : ",v.end);
                        }
                    }
                });
            }
        } else {
            console.error("can not draw link,need config 'path' and 'path' is Array and not empty, path used to find start and end");
        }
    }
}
function drawAlarm(scene,config){
    if(config){
        if ($.isArray(config.data)&&config.node) {
            var alarmData=config.data;
            var findNode=config.node;
            var alarmNodes=[];
            $.each(alarmData,function(k,v){
                var node=scene.find(findNode + "=" + v[findNode],"node")[0];
                if(node){
                    alarmNodes.push({
                        node:node,
                        alarm:{
                            show: typeof v.show=="undefined"?true: v.show,
                            text: v.text,
                            color: v.color,
                            font: v.font
                        }
                    });
                }
            });
            if(config.animate){
                alarmAnimate(config.animate,alarmNodes);
            }else{
                console.info("alarm nodes : "+alarmNodes.length);
                $.each(alarmNodes,function(i,v){
                    v.node.set({
                        alarm:v.alarm
                    });
                });
            }
        }
    }
}
var animateRuning;
function alarmAnimate(animate,alarmNodes){
    if(animate){
        if($.isNumeric(animate.time)){
            clearAnimat();
            console.info("begin alarm animate times : "+alarmNodes.length);
            animateRuning=setInterval(function(){
                if(alarmNodes.length>0){
                    var data=alarmNodes.pop();
                    data.node.set({
                        alarm:data.alarm
                    });
                    if($.isFunction(animate.callBack)){
                        animate.callBack(data.node);
                    }
                }else{
                    clearAnimat();
                }
            },parseInt(animate.time));
        }
    }
}
function clearAnimat(){
    if(animateRuning){
        console.info("end alarm animate");
        clearInterval(animateRuning);
        animateRuning="";
    }
}
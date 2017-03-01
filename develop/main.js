/**
 * Created by qiyc on 2017/2/6.
 */
//核心依赖
require("./core/jtopo/jtopo-min.js");
if(typeof jQuery =="undefined"){
    throw new Error("need jquery");
}
//QTopo
var QTopo = {
    instance: [],
    util: require('./util.js'),
    constant: require('./constant.js')
};
window.QTopo = QTopo;
var Scene = require('./core/Scene.js');
require("./core/tools.js");//加载scene的工具api
QTopo.init = function (dom, config) {
    dom = dom instanceof Array ? dom[0] : dom;
    var canvas = initCanvas(dom, $(dom).width(), $(dom).height());
    var QtopoInstance = {
        scene: new Scene(new JTopo.Stage(canvas), config),
        setOption: setOption,
        document: dom,
        resize: resize(dom, canvas)
    };
    this.instance.push(QtopoInstance);
    return QtopoInstance;
};
//---------------------
function setOption(option, clear) {
    option=option||{};
    var scene = this.scene;
    if (clear) {
        scene.clear();
    }
    createNode(scene, option.node);
    createContainer(scene, option.container);
    createLink(scene, option.link);
    createLine(scene,option.line);
    drawAlarm(scene, option.alarm);
    scene.goCenter();
}
function resize(dom, canvas) {
    return function () {
        canvas.setAttribute('width', $(dom).width());
        canvas.setAttribute('height', $(dom).height());
    }
}
function initCanvas(dom, width, height) {
    if (width <= 0 || height <= 0) {
        throw new Error("The dom is not exist /not config width and height!");
    }
    dom.style.position = 'relative';
    dom.style.overflow = 'hidden';
    var canvas = document.createElement('canvas');
    dom.appendChild(canvas);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style['user-select'] = 'none';
    canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';
    return canvas;
}
function createNode(scene, config) {
    if (config) {
        setDefaults(scene,QTopo.constant.node,config.style);
        if ($.isArray(config.data)) {
            $.each(config.data, function (i, item) {
                var node = scene.createNode(item);
                //额外属性添加
                setExtra(config.extra,node,item);
            });
        }
    }
}
//排除临时元素
function notCasual(arr) {
    if(arr.length==1){
        return arr[0];
    }else{
        for(var i = 0; i < arr.length; i++) {
            if (arr[i].getUseType() != QTopo.constant.CASUAL) {
                arr = arr[i];
                return arr;
            }
        }
    }
}
function createContainer(scene, config) {
    if (config) {
        var findChild;
        if (config.children) {
            findChild = config.children;
        }
        setDefaults(scene,QTopo.constant.container,config.style);
        if ($.isArray(config.data)) {
            //开始构造分组
            $.each(config.data, function (i, item) {
                //无论是否有子元素，分组先创造出来
                var container = scene.createContainer(item);
                //额外属性添加
                setExtra(config.extra,container,item);
                //确定查找子元素的标记
                var findChild_exact = findChild;
                if (item.children) {
                    findChild_exact = item.children;
                }
                //查找子元素并塞入
                if (findChild_exact) {
                    $.each(item.data, function (j, children) {
                        var child = scene.find(findChild_exact + "=" + children);
                        if (child && child.length > 0) {
                            $.each(child, function (m, one) {
                                if(one.getUseType() != QTopo.constant.CASUAL){
                                    container.add(one);
                                }
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
            //设置默认属性
            setDefaults(scene,QTopo.constant.link,config.style);
            //开始创建
            if ($.isArray(config.data)) {
                $.each(config.data, function (i, item) {
                    var link;
                    //根据确定的条件进行搜索
                    var start = notCasual(scene.find(findStart + "=" + item.start));
                    var end = notCasual(scene.find(findEnd + "=" + item.end));
                    if (start && end) {
                        item.start = start;
                        item.end = end;
                        link = scene.addLink(item);
                        //额外属性添加
                        setExtra(config.extra,link,item);
                    } else {
                        console.error("some link path invalid : " + i, item);
                        if (!start) {
                            console.error("start not found : ", item.start);
                        }
                        if (!end) {
                            console.error("end not found : ", item.end);
                        }
                    }
                });
            }

        } else {
            console.error("can not draw link,need config 'path' and 'path' is Array and not empty, path used to find start and end");
        }
    }
}
function createLine(scene, config){
    if(config){
        //设置默认属性
        //设置默认属性
        setDefaults(scene,QTopo.constant.line,config.style);
        //开始创建
        if ($.isArray(config.data)) {
            $.each(config.data,function(i,v){
                var line = scene.createLine(v);
                //额外属性添加
                setExtra(config.extra,line,v);
            });
        } else {
            console.error("can not draw line,need config 'path' and 'path' is Array and not empty,path's element need config x y, path used to find start and end");
        }
    }
}
function drawAlarm(scene, config) {
    if (config) {
        if ($.isArray(config.data) && config.node) {
            var alarmData = config.data;
            var findNode = config.node;
            var alarmNodes = [];
            $.each(alarmData, function (k, v) {
                var node = notCasual(scene.find(findNode + "=" + v["node"], "node"));
                if (node) {
                    alarmNodes.push({
                        node: node,
                        alarm: {
                            show: typeof v.show == "boolean" ? v.show : true,
                            text: v.text,
                            color: v.color,
                            font: v.font
                        }
                    });
                }
            });
            if (config.animate) {
                alarmAnimate(config.animate, alarmNodes);
            } else {
                console.info("alarm nodes : " + alarmNodes.length);
                $.each(alarmNodes, function (i, v) {
                    v.node.set({
                        alarm: v.alarm
                    });
                });
            }
        }
    }
}
var animateRuning;
function alarmAnimate(animate, alarmNodes) {
    if (animate) {
        if ($.isNumeric(animate.time)) {
            clearAnimat();
            console.info("begin alarm animate times : " + alarmNodes.length);
            animateRuning = setInterval(function () {
                if (alarmNodes.length > 0) {
                    var data = alarmNodes.pop();
                    data.node.set({
                        alarm: data.alarm
                    });
                    if ($.isFunction(animate.callBack)) {
                        animate.callBack(data.node);
                    }
                } else {
                    clearAnimat();
                }
            }, parseInt(animate.time));
        }
    }
}
function clearAnimat() {
    if (animateRuning) {
        console.info("end alarm animate");
        clearInterval(animateRuning);
        animateRuning = "";
    }
}
function setExtra(list,element,data){
    if ($.isArray(list)&&element&&data) {
        $.each(list, function (j, key) {
            if (data[key]) {
                if(!element.extra){
                    element.extra={};
                }
                element.extra[key] = data[key];
            }
        });
    }
}
function setDefaults(scene,typeArr,style){
    if(style){
        $.each(typeArr,function(i,types){
            scene.setDefault(types,style);
        })
    }
}
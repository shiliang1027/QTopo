/** @module QTopo */
//核心依赖
require("./core/jtopo/jtopo-min.js");
if (typeof jQuery == "undefined") {
    throw new Error("need jquery");
}
//QTopo
var QTopo = {
    instance: [],
    util: require('./util.js'),
    constant: require('./constant.js'),
    log: {
        error: true,
        info: true
    }
};
window.QTopo = QTopo;
var Scene = require('./core/Scene.js');
require("./core/tools.js");//加载scene的工具api
/**
 * 初始化Qtopo
 * @param dom
 * @param config
 * @see module:QTopo
 * @returns {{scene: (Scene|exports|module.exports), setOption: setOption, document: *, resize, serialize: serialize}}
 */
/**
 * 初始化
 * @alias module:Qtopo.init
 */
QTopo.init = function (dom, config) {
    dom = dom instanceof Array ? dom[0] : dom;
    var canvas = initCanvas(dom, $(dom).width(), $(dom).height());
    var QtopoInstance = {
        scene: new Scene(new JTopo.Stage(canvas), config),
        setOption: setOption,
        document: dom,
        resize: resize(dom, canvas),
        serialize:serialize
    };
    this.instance.push(QtopoInstance);
    return QtopoInstance;
};
module.exports=QTopo;
//---------------------
function setOption(option, clear) {
    option = option || {};
    QTopo.util.info("start set topo: ", option);
    var scene = this.scene;
    if (clear) {
        scene.clear();
    }
    createNode(scene, option.node);
    createContainer(scene, option.container);
    createLink(scene, option.link);
    createLine(scene, option.line);
    drawAlarm(scene, option.alarm);
    QTopo.util.info("set topo complete: ", {
        node:scene.children.node.length,
        link:scene.children.link.length,
        container:scene.children.container.length,
        line:scene.children.line.length
    });
    return this;
}
function resize(dom, canvas) {
    return function () {
        canvas.setAttribute('width', $(dom).width());
        canvas.setAttribute('height', $(dom).height());
        return this;
    }
}
function serialize(){
    var data=this.scene.children;
    var serialized={
        init:this.scene.serialize(),
        option:{
            node:{
                data:[]
            },
            link:{
                data:[]
            },
            container:{
                data:[]
            },
            line:{
                data:[]
            }
        }
    };
    $.each(data,function(name,elements){
        if($.isArray(elements)){
            elements.map(function(element){
                if(serialized.option[name]){
                    serialized.option[name].data.push(element.serialize());
                }
            });
        }
    });
    return serialized;
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
        setDefaults(scene, QTopo.constant.node, config.style);
        if ($.isArray(config.data)) {
            $.each(config.data, function (i, item) {
                var node = scene.createNode(item);
                //额外属性添加
                setExtra(node, item);
            });
        }
    }
}

//排除临时元素
function notCasual(arr) {
    if (arr.length == 1) {
        return arr[0];
    } else {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].getUseType() != QTopo.constant.CASUAL) {
                arr = arr[i];
                return arr;
            }
        }
    }
}
//根据配置创建分组
function createContainer(scene, config) {
    if (config) {
        setDefaults(scene, QTopo.constant.container, config.style);
        makeContainer(scene, config);
    }
}
function makeContainer(scene, config) {
    //搜索子的总标记
    var findChild;
    if (config.findChildren) {
        findChild = config.findChildren;
    }
    if ($.isArray(config.data)) {
        //开始构造分组
        $.each(config.data, function (i, item) {
            //无论是否有子元素，分组先创造出来
            var container = scene.createContainer(item);
            //额外属性添加
            setExtra(container, item);
            //确定查找子元素的标记
            var findChild_exact = findChild;
            if (item.findChildren) {
                findChild_exact = item.findChildren;
            }
            makeChildren(scene, container, item, findChild_exact);
        });
    }
}
function makeChildren(scene, container, config, findChild) {
    //过滤搜索子类的标记
    findChild=filterTag(findChild);
    if ($.isArray(config.children)) {
        var errorInfo=[];
        $.each(config.children, function (j, children) {
            var child = scene.find(findChild + "=" + children);
            if (child && child.length > 0) {
                $.each(child, function (m, one) {
                    if (one.getUseType() != QTopo.constant.CASUAL) {
                        container.add(one);
                    }
                });
            } else {
                errorInfo.push({
                    index: j,
                    search: findChild + "=" + children
                });
            }
        });
        if(errorInfo.length>0){
            QTopo.util.error( "some child not found : ",errorInfo);
        }
    }
}
function filterTag(tag){
    if(!tag){
        tag='serializeId'
    }
    return tag;
}
//根据配置创建链接
function createLink(scene, config) {
    if (config) {
        var path = config.path;
        var findStart;
        var findEnd;
        if ($.isArray(path) && path.length > 0) {
            //path为数组，0为起点条件1为终点条件,确定搜索条件,起始点条件可不同
            if (path.length == 1) {
                findEnd = path[0];
                findStart = findEnd;
            } else {
                findStart = path[0];
                findEnd = path[1];
            }
        } else {
            findStart=filterTag(findStart);
            findEnd=filterTag(findEnd);
        }
        //设置默认属性
        setDefaults(scene, QTopo.constant.link, config.style);
        //开始创建
        makeLink(scene, config, findStart, findEnd);
    }
}
function makeLink(scene, config, findStart, findEnd) {
    if ($.isArray(config.data)) {
        var errorInfo=[];
        $.each(config.data, function (i, item) {
            if (item) {
                var link;
                //根据确定的条件进行搜索
                var start = notCasual(scene.find(findStart + "=" + item.start));
                var end = notCasual(scene.find(findEnd + "=" + item.end));
                if (start && end) {
                    item.start = start;
                    item.end = end;
                    link = scene.addLink(item);
                    //额外属性添加
                    setExtra(link, item);
                } else {
                    var errorDate = {
                        index: i,
                        data: item
                    };
                    if (!start) {
                        errorDate.missStart = item.start;
                    }
                    if (!end) {
                        errorDate.missEnd = item.end;
                    }
                    errorInfo.push(errorDate);
                }
            } else {
                errorInfo.push({
                        index:i,
                        info:"undefined data"
                });
            }
        });
        if(errorInfo.length>0){
            QTopo.util.error("some link invalid : ", errorInfo);
        }
    }
}
//根据配置创建线段
function createLine(scene, config) {
    if (config) {
        //设置默认属性
        //设置默认属性
        setDefaults(scene, QTopo.constant.line, config.style);
        //开始创建
        if ($.isArray(config.data)) {
            $.each(config.data, function (i, v) {
                var line = scene.createLine(v);
                //额外属性添加
                setExtra(line, v);
            });
        } else {
            QTopo.util.error("can not draw line,need config 'path' and 'path' is Array and not empty,path's element need config x y, path used to find start and end");
        }
    }
}
//告警处理...
function drawAlarm(scene, config) {
    if (config) {
        if ($.isArray(config.data) && config.node) {
            var alarmData = config.data;
            var alarmNodes = makeAlarmData(scene, alarmData, config);
            QTopo.util.info("告警绘制 :", {
                config:alarmData.length,
                success:alarmNodes.length
            });
            if (config.animate) {
                alarmAnimate(config.animate, alarmNodes);
            } else {
                $.each(alarmNodes, function (i, v) {
                    v.node.set({
                        alarm: v.alarm
                    });
                });
            }
        }
    }
}
function makeAlarmData(scene, alarmData, config) {
    var alarms = [];
    $.each(alarmData, function (k, v) {
        var node = notCasual(scene.find(config.node + "=" + v["node"], "node"));
        if (node) {
            alarms.push({
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
    return alarms;
}
var animateRuning;
function alarmAnimate(animate, alarmNodes) {
    if (animate) {
        if ($.isNumeric(animate.time)) {
            clearAnimat();
            QTopo.util.info("启用告警动画");
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
                    QTopo.util.info("告警动画结束");
                    clearAnimat();
                }
            }, parseInt(animate.time));
        }
    }
}
function clearAnimat() {
    if (animateRuning) {
        clearInterval(animateRuning);
        animateRuning = "";
    }
}
function setExtra(element,data){
    if(data){
        $.each(data,function(key,value){
            if(filterConfig(element,key)&&["start","end","children","toggle","type","extra"].indexOf(key)<0){
                element.extra[key]=value;
            }
        });
        if(data.extra){
            $.each(data.extra,function(key,value){
                if(value){
                    element.extra[key]=value;
                }
            });
        }
    }
}
function filterConfig(element,key){
    return element&&typeof element.attr[key]=='undefined';
}
function setDefaults(scene, typeArr, style) {
    if (style) {
        $.each(typeArr, function (i, types) {
            scene.setDefault(types, style);
        })
    }
}
/**
 * @module QTopo
 */
require("./core/jtopo/jtopo-min.js");
if (typeof jQuery == "undefined") {
    throw new Error("need jquery");
}
/**
 * 主入口,window.QTopo
 * @class QTopo
 * @static
 */
var QTopo = {
    /**
     * 存放当前页面中所初始化的topo实例
     * @property instance {array}
     */
    instance: [],
    /**
     * 一系列工具函数,详细内容参考 QTopo.util
     * @property util {object}
     */
    util: require('./util.js'),
    constant: require('./constant.js'),
    /**
     * 可开启或屏蔽控制台日志,对应用QTopo.util.info以及QTopo.util.error函数输出的日志
     * @property log {object}
     * @param error {boolean} 默认为true,开启
     * @param info {boolean} 默认为true,开启
     */
    log: {
        error: true,
        info: true
    }
};
window.QTopo = QTopo;
var Scene = require('./core/Scene.js');
/**
 * 初始化Qtopo实例,创建并将其保存在QTopo.instance数组内,实例api参考QTopo.instance
 *  @method init
 *  @param dom {document} 指定初始化所在的dom,若是数组则自动取第一个
 *  @param [config] {object} 配置参数,配置内容为图层scene配置(参考scene配置)和组件模块初始化配置(参考component配置)
 *  @returns instance QTopo实例
 *  @example
 *      IPOSS = QTopo.init(
 *           document.getElementsByClassName("topo_base")[0],
 *          {
 *              backgroundColor: "#06243e",
 *              hideDefaultSearch: true,
 *              filterMenu: ["创建节点", "添加链路", "删除", "编辑", "元素切换","分组操作"],
 *              filterWindow: ["imageNode", "link"]
 *          }
 *      );
 */
QTopo.init = function (dom, config) {
    dom = dom instanceof Array ? dom[0] : dom;
    var canvas = initCanvas(dom, $(dom).width(), $(dom).height());
    /**
     * QTopo初始化的topo实例,QTopo.init后的返回对象，或是QTopo.instance数组内保存的对象
     * @class QTopo.instance
     * @static
     */
    var QtopoInstance = {
        /**
         * topo实例化的图层对象
         * @property scene {object}
         */
        scene: new Scene(canvas, config),
        setOption: setOption,
        /**
         * topo实例所在dom
         * @property document {document}
         */
        document: dom,
        resize: resize(dom, canvas),
        toJson: toJson
    };
    this.instance.push(QtopoInstance);
    return QtopoInstance;
};
module.exports = QTopo;
//---------------------
/**
 * 图层绘制主函数
 *
 * 可以随时使用setOption生成一个或多个元素,或配置告警，也可以一次性全局配置
 *
 * 相关的全局样式请参考各元素自身的attr属性,或通过 元素的getDefault() / scene.getDefault(type)来获取对应元素的全局样式
 *
 * 前端绘图过程可以用工具栏和右键菜单绘制完成后,配合实例的toJson函数取得图层数据,(实例通过QTopo.init初始化且保存在QTopo.instance数组内)
 *
 * 直接将返回对象的option属性传入setOption可复制绘图
 *
 * 每个元素配置的data数组内成员的属性可以是样式也可以是额外属性,自适应取值配置，过滤的额外属性自动分配到元素的extra属性中保存,可以通过node.val('id')的形式获取
 *
 * 和样式重名的额外属性可以放在extra中，extra中的属性将默认全部覆盖到元素的extra属性内
 *
 *  @method setOption
 *  @param option {object} 配置属性,参数可以是instance.toJson().option对象
 *      @param [option.node] {object} 创建node元素
 *          @param [option.node.style] {object} 设定全局的节点样式，未配置样式的节点会采用默认样式
 *          @param option.node.data {array} 细则看示例
 *      @param [option.container] {object} 创建container元素
 *          @param [option.container.style] {object} 设定全局的分组样式，未配置样式的分组会采用默认样式
 *          @param option.container.findChildren {string} 通知分组通过什么属性去查找成员
 *          @param option.container.data {array} 细则看示例
 *      @param [option.link] {object} 创建link元素
 *          @param [option.link.style] {object} 设定全局的分组样式，未配置样式的分组会采用默认样式
 *          @param option.link.path {array} 通知链接通过什么属性去查找起始点和终点,数组参数可以为1个或2个，当设置为2个时，通过不同属性查找起始点和终点
 *          @param option.link.data {array} 细则看示例
 *      @param [option.line] {object} 创建line元素
 *      @param [option.alarm] {object} 配置告警
 *          @param option.alarm.node {string} 通知告警模块如何查找需要设定告警的节点,现只支持节点上的告警
 *          @param [option.alarm.animate] {object} 配置告警动画,包含2个属性 ：
 *                     1. time:{number}设定间隔时间,单位为毫秒 ,
 *                     2. callBack:{function}回调函数,参数为当前处理告警的节点
 *          @param option.alarm.data {array} 告警设置,包含3个属性 ：
 *                     1. color {string}:告警展示的颜色,255,255,255/#ffffff ,
 *                     2. node {string}:对应告警属性下的node为键,此处为值来查找对应的节点 ,
 *                     3. [text] {string}:告警显示的文字信息，可不设或为空 ,
 *  @param [clear=false] {boolean} 是否清空图层，默认不清除
 *  @returns instance
 *  QTopo实例自身,用以链式操作
 *  @example
 *       topo.setOption({
                node: {
                    style:{//全局样式
                        size:[60,60],
                        image: "img/node.png"
                    },
                    data: [{
                            position:[-200,-200],
                            size:[100,100],
                            id:1111,
                            name:"测试1\nhhhh" //\n为名称换行
                           },
                           {
                            position:[0,0],
                            size:[100,100],
                            id:2222,
                            name:"测试2\nhhhh" //
                           }]
                },
                container: {
                    style:{
                        color:"#165782",
                        alpha:0.3,
                        border:{
                            radius:10
                        },
                        namePosition:"top"
                    },
                    findChildren: "id",//这个决定了 每个分组根据data中的数据查找该加入的子,该属性应在node中的value中有配置
                    data: [{
                            size:[400,400],
                            position:[0,0],
                            layout:{
                                type:"fixed"//布局为固定
                            },
                            children: childrenData,
                            toggle:{ //分组切换的节点样式
                                image: "img/node.png"
                            }
                          //  findChildren: "id", 当然也可以针对某个分组单独设置其查找子元素的标记
                            children:["1111","2222"]//findChildren定义为id ，此处就该是对应元素的id属性
                        }]
                },
                link: {
                    style:{
                        color:"#00FFFF"
                    },
                    path: ["id"],   //决定了线的起始节点由什么属性决定,数组长度为1则起始节点按统一属性查找，可分别设不同，0为起始节点属性.1为终点,该属性应在node中的value中有配置
                    data: [{
                                start:1111,//path指明起始点和终点都是找id属性，那此处就是起点的id
                                end:2222,   //终点的id
                                width:10,   //样式配置，详细参考对应元素的属性
                                radius:25,
                                arrow:{
                                    end:true,
                                    start:true,
                                    size:10
                                },
                                extra:{
                                    type:1  //额外属性，因与下述链路类型的名称一致，移直extra内赋值到生成的链路extra上,可通过link.val('type')取到
                                },
                                type:QTopo.constant.link.FLEXIONAL //建立的链路类型
                            }]
                },
                alarm: {
                    node: "alarmId",    //指明节点上对应的查找属性,该属性应在node中的value中有配置,暂只支持节点告警
                    data: [],
                    animate:{   //可设置动画，每个点亮之间延迟多少毫秒，回调函数中能获取到点亮的节点信息
                        time:1000,
                        callBack:function(node){
                            console.info(node)
                        }
                    }
                }
            })
 */
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
        node: scene.children.node.length,
        link: scene.children.link.length,
        container: scene.children.container.length,
        line: scene.children.line.length
    });
    return this;
}
/**
 * 实例自适应大小
 *  @method resize
 *  @returns instance QTopo实例自身,用以链式操作
 *  @example
 *      $(window).resize(function () {
 *          IPOSS.resize();
 *      });
 */
function resize(dom, canvas) {
    return function () {
        canvas.setAttribute('width', $(dom).width());
        canvas.setAttribute('height', $(dom).height());
        return this;
    }
}
/**
 * 当前图层数据转化为json结构
 *  @method toJson
 *  @returns {object}
 *  @example
        var IPOSS=QTopo.instance[0];
        var json=IPOSS.toJson();    //json={
                                    //         init:图层参数,scene对象的参数配置,
                                    //         option:图层内所有对象的属性提取，可直接用于setOption还原,其中jsonId用做每个元素的唯一标识
                                    //      }
        IPOSS.setOption(json.option,true);
 */
function toJson() {
    var data = this.scene.children;
    var serialized = {
        init: this.scene.toJson(),
        option: {
            node: {
                data: []
            },
            link: {
                data: []
            },
            container: {
                data: []
            },
            line: {
                data: []
            }
        }
    };
    $.each(data, function (name, elements) {
        if ($.isArray(elements)) {
            elements.map(function (element) {
                if (serialized.option[name]) {
                    serialized.option[name].data.push(element.toJson());
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
    findChild = filterTag(findChild);
    if ($.isArray(config.children)) {
        var errorInfo = [];
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
        if (errorInfo.length > 0) {
            QTopo.util.error("some child not found : ", errorInfo);
        }
    }
}
function filterTag(tag) {
    if (!tag) {
        tag = 'jsonId'
    }
    return tag;
}

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
            findStart = filterTag(findStart);
            findEnd = filterTag(findEnd);
        }
        //设置默认属性
        setDefaults(scene, QTopo.constant.link, config.style);
        //开始创建
        makeLink(scene, config, findStart, findEnd);
    }
}
function makeLink(scene, config, findStart, findEnd) {
    if ($.isArray(config.data)) {
        var errorInfo = [];
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
                    index: i,
                    info: "undefined data"
                });
            }
        });
        if (errorInfo.length > 0) {
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

function drawAlarm(scene, config) {
    if (config) {
        if ($.isArray(config.data) && config.node) {
            var alarmData = config.data;
            var alarmNodes = makeAlarmData(scene, alarmData, config);
            QTopo.util.info("告警绘制 :", {
                config: alarmData.length,
                success: alarmNodes.length
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
function setExtra(element, data) {
    if (data) {
        $.each(data, function (key, value) {
            if (filterConfig(element, key) && ["start", "end", "children", "toggle", "type", "extra"].indexOf(key) < 0) {
                element.extra[key] = value;
            }
        });
        if (data.extra) {
            $.each(data.extra, function (key, value) {
                if (value) {
                    element.extra[key] = value;
                }
            });
        }
    }
}
function filterConfig(element, key) {
    return element && typeof element.attr[key] == 'undefined';
}
function setDefaults(scene, typeArr, style) {
    if (style) {
        $.each(typeArr, function (i, types) {
            scene.setDefault(types, style);
        })
    }
}





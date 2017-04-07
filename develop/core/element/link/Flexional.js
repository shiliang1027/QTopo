/**
 * @module core
 */
/**
 * 二次折线链路
 * @class  FlexionalLink
 * @constructor
 * @extends [L] Link
 * @param [config] 配置参数，无参则按全局配置创建
 */
var Link = require("./Link.js");
module.exports = {
    constructor: FlexionalLink,
    setDefault: setDefault,
    getDefault: getDefault
};
//-
var DEFAULT = {
    number: 1,
    alpha: 1,
    color: '22,124,255',
    arrow: {
        size: 10,
        offset: 0,
        start: false,
        end: false
    },
    jsonId:"",
    radius: 0,
    gap: 20,
    width: 2,
    dashed: null,
    zIndex: 100,
    font: {
        size: 16,
        type: "微软雅黑",
        color: '255,255,255'
    },
    useType: QTopo.constant.link.FLEXIONAL,
    direction: "horizontal",
    offsetGap: 60//折线处长度
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//-
//-----
var jtopoReset = {
    paintPath: function (cx, path) {
        var attr = this.qtopo.attr;
        if (this.nodeA === this.nodeZ)return void this.paintLoop(cx);
        var start = path[0];
        var end = path[path.length - 1];
        cx.beginPath();
        cx.moveTo(start.x, start.y);
        for (var i = 1; i < path.length; i++) {
            if (null == this.dashedPattern) {
                if (attr.radius > 0) {
                    if (i < path.length - 1) {
                        cx.arcTo(path[i].x, path[i].y,path[i + 1].x, path[i + 1].y,attr.radius);//增加折线弧度
                    } else {
                        cx.lineTo(path[i].x, path[i].y);
                    }
                } else {
                    cx.lineTo(path[i].x, path[i].y);
                }
            } else {
                cx.JTopoDashedLineTo(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, this.dashedPattern);
            }
        }
        cx.stroke();
        cx.closePath();
        if (null != this.arrowsRadius) {
            if (attr.arrow.end) {
                this.paintArrow(cx, path[path.length - 2], path[path.length - 1]);
            }
            if (attr.arrow.start) {
                this.paintArrow(cx, path[1], path[0]);//添加双向箭头
            }
        }
    }
};
//-----
function FlexionalLink(config) {
    if (!config.start || !config.end || !config.start.jtopo || !config.end.jtopo) {
        QTopo.util.error("Create Link need start and end");
        return;
    }
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Link.call(this, new JTopo.FlexionalLink(config.start.jtopo, config.end.jtopo));
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //修改源码
    reset(this);
}
QTopo.util.inherits(FlexionalLink, Link);
/**
 *  元素对属性的统一设置函数，推荐使用
 *
 *  参数可设置一项或多项,未设置部分参考全局配置
 *  @method set
 *  @param config
 *  @example
 *          实际参数参考attr内属性,只会修改有对应set函数的属性,若新增属性且添加了setXXX函数，也可用此函数配置
 *          如:name 对应 setName("..")
 *          参数格式如下
 *          config={
 *              xx:...,
 *              xx:...
 *          }
 */
function setJTopo(config) {
    if (config) {
        var self = this;
        this._setAttr(config);
    }
}
function reset(link) {
    //双向箭头
    link.jtopo.paintPath = jtopoReset.paintPath;
}
/**
 *  两端折线线段的长度
 *
 *  @method setOffsetGap
 *  @param offsetGap {number}
 */
FlexionalLink.prototype.setOffsetGap = function (offsetGap) {
    if ($.isNumeric(offsetGap)) {
        this.jtopo.offsetGap = parseInt(offsetGap);
    }
    this.attr.offsetGap = this.jtopo.offsetGap;
};
/**
 *  设置折线方向
 *
 *  @method setDirection
 *  @param direction {string} horizontal 水平 "vertical"垂直
 */
FlexionalLink.prototype.setDirection = function (direction) {
    //折线方向 horizontal 水平 "vertical"垂直
    if (direction) {
        this.jtopo.direction = direction;
    }
    this.attr.direction = this.jtopo.direction;
};
/**
 *  设置折角弧度
 *
 *  @method setRadius
 *  @param radius {number}
 */
FlexionalLink.prototype.setRadius = function (radius) {
    if ($.isNumeric(radius)) {
        radius = parseInt(radius);
        if (radius > 20) {
            radius = 20;
        } else if (radius < 0) {
            radius = 0;
        }
        this.attr.radius = radius;
    }
};
/**
 * 获取元素全局样式
 * @method getDefault
 * @return {object}
 * @example
 *         var DEFAULT = {
                            number: 1,
                            alpha: 1,
                            color: '22,124,255',
                            arrow: {
                                size: 10,
                                offset: 0,
                                start: false,
                                end: false
                            },
                            jsonId:"",
                            radius: 0,
                            gap: 20,
                            width: 2,
                            dashed: null,
                            zIndex: 100,
                            font: {
                                size: 16,
                                type: "微软雅黑",
                                color: '255,255,255'
                            },
                            useType: QTopo.constant.link.FLEXIONAL,
                            direction: "horizontal",
                            offsetGap: 60//两端折线线段的长度
                        };
 */
FlexionalLink.prototype.getDefault = getDefault;
/*一种绘制固定在节点右侧的二次线*/
//resetFold.jtopo.getPath =poinst;
function poinst() {
    //重写线的绘制路径
    var littleSize = 50;
    var startRight = {
        x: start.x + start.width,
        y: start.y + start.height / 2
    };
    var endRight = {
        x: end.x + end.width,
        y: end.y + end.height / 2
    };
    var middleA = {};
    var middleB = {};
    if (startRight.x > endRight.x) {
        middleA.x = startRight.x + littleSize;
        middleA.y = startRight.y;
        middleB.x = startRight.x + littleSize;
        middleB.y = endRight.y;
    } else {
        middleA.x = endRight.x + littleSize;
        middleA.y = startRight.y;
        middleB.x = endRight.x + littleSize;
        middleB.y = endRight.y;
    }
    return [startRight, middleA, middleB, endRight];
}
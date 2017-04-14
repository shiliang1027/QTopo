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
        type:'close',
        size: 10,
        offset: 0,
        start: false,
        end: false
    },
    jsonId: "",
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
    offset: 60//折线处长度
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//-
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
                            offset: 60//两端折线线段的长度
                        };
 */
FlexionalLink.prototype.getDefault = getDefault;

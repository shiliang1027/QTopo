/**
 * @module core
 */
/**
 * 直线链路
 * @class  DirectLink
 * @constructor
 * @extends [L] Link
 * @param [config] 配置参数，无参则按全局配置创建
 */
var Link = require("./Link.js");
module.exports = {
    constructor: DirectLink,
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
    jsonId: "",
    gap: 20,
    width: 3,
    dashed: null,
    zIndex: 100,
    font: {
        size: 16,
        type: "微软雅黑",
        color: '255,255,255'
    },
    expendAble: true,
    useType: QTopo.constant.link.DIRECT,
    bundleOffset: 60// 多条直线时，线条折线拐角处的长度
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//------
//------
//-
function DirectLink(config) {
    if (!config.start || !config.end || !config.start.jtopo || !config.end.jtopo) {
        QTopo.util.error("Create Link need start and end");
        return;
    }
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Link.call(this, new JTopo.Link(config.start.jtopo, config.end.jtopo));
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
}
QTopo.util.inherits(DirectLink, Link);
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
        self._setAttr(config);
    }
}
/**
 *  设置直线两端的线段长度
 *
 *  当一条链路的两端元素之间有多条链路时，链路将会分成三段绘制并偏移，以区分其他链路
 *  @method setBundleOffset
 *  @param bundleOffset {number}
 */
DirectLink.prototype.setBundleOffset = function (bundleOffset) {
    if ($.isNumeric(bundleOffset)) {
        this.jtopo.bundleOffset = parseInt(bundleOffset);
    }
    this.attr.bundleOffset = this.jtopo.bundleOffset;
};
/**
 * 获取元素全局样式
 * @method getDefault
 * @return {object}
 * @example
 *          var DEFAULT = {
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
                                gap: 20,
                                width: 3,
                                dashed: null,
                                zIndex: 100,
                                font: {
                                    size: 16,
                                    type: "微软雅黑",
                                    color: '255,255,255'
                                },
                                expendAble: true,
                                useType: QTopo.constant.link.DIRECT,
                                bundleOffset: 60// 多条直线时，线条折线拐角处的长度
                            };
 */
DirectLink.prototype.getDefault = getDefault;
/**
 * 开启链路展开模式,为链路生成toggle函数
 * @method openToggle
 * @param scene {scene}链路所在图层
 */
DirectLink.prototype.openToggle = function (scene) {
    this.attr.expendAble = true;
    var jtopo = scene.jtopo;
    /**
     * 链路展开/合并切换
     * @method toggle
     * @param [flag] {boolean}为true则展开为false则缩放，无值则根据现状自适应切换,
     */
    this.toggle = function (flag) {
        var todo = !(this.getUseType() == QTopo.constant.CASUAL && this.parent);
        if (typeof flag == "boolean" && (flag ^ todo)) {
            return;
        }
        if (todo) {
            //展开
            //复制属性
            if (this.attr.number > 1 && this.attr.expendAble) {
                var childSet = QTopo.util.deepClone(this.attr);
                childSet.start = this.path.start;
                childSet.end = this.path.end;
                childSet.useType = QTopo.constant.CASUAL;
                childSet.number = 1;
                var parent = {
                    attr: this.attr,
                    extra: this.extra,
                    path: this.path,
                    addChild: function (num) {
                        if ($.isNumeric(num)) {
                            num = parseInt(num);
                            for (var i = 0; i < num; i++) {
                                var link = scene.createLink(childSet);
                                parent.children.push(link);
                                link.parent = parent;
                                link.extra = parent.extra;
                            }
                        }
                    },
                    children: []
                };
                scene.remove(this);
                parent.addChild(parent.attr.number);
            }
        } else {
            //聚合
            var father = this.parent;
            scene.remove(father.children);
            var config = father.attr;
            config.start = father.path.start;
            config.end = father.path.end;
            scene.createLink(config).extra = father.extra;
        }
    };
};
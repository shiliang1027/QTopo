/**
 * @module core
 */
/**
 * 链路基类,用以继承
 * @class [L] Link
 * @constructor
 * @extends [E] Element
 * @param jtopo 元素核心的jtopo对象
 */
var Element = require("../Element.js");
module.exports = Link;
var jtopoReset = {
    //原选取后效果较暗，在暗色主题下不明显，重写为亮色
    paintSelected: function (a) {
        a.shadowBlur = 10;
        a.shadowColor = "rgba(255,255,255,1)";
        a.shadowOffsetX = 0;
        a.shadowOffsetY = 0;
    }
};
function Link(jtopo) {
    if (!jtopo) {
        QTopo.util.error("create Link without jtopo", this);
        return;
    }
    Element.call(this, jtopo);
    /**
     * 记录链路的首尾元素
     * @property [L] path {object}
     * @param start {object} 起始元素
     * @param end {object} 终点元素
     */
    this.path = {
        start: this.jtopo.nodeA.qtopo,
        end: this.jtopo.nodeZ.qtopo
    };
    //在线路两端的对象上的links属性中更新自己
    if (this.path.start.links && $.isArray(this.path.start.links.out)) {
        if (this.path.start.links.out.indexOf(this) < 0) {
            this.path.start.links.out.push(this);
        }
    }
    if (this.path.end.links && $.isArray(this.path.end.links.in)) {
        if (this.path.end.links.in.indexOf(this) < 0) {
            this.path.end.links.in.push(this);
        }
    }
    reset(this.jtopo);
}
QTopo.util.inherits(Link, Element);

function reset(jtopo) {
    //被選中后的样式
    jtopo.paintSelected = jtopoReset.paintSelected;
}
/**
 *  获取元素基本类型,详细参考QTopo.constant中的类型定义
 *  @method [L] getType
 *  @return QTopo.constant.LINK
 */
Link.prototype.getType = function () {
    return QTopo.constant.LINK;
};
/**
 *  设置颜色
 *  @method [L] setColor
 *  @param color {string} "255,255,255"/"#ffffff"
 */
Link.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color = this.jtopo.strokeColor;
};
/**
 *  计数设置
 *
 *  计数大于1时在链路上显示(+number)
 *
 *  QTopo.constant.link.DIRECT类型的链路可以基于此数展开
 *  @method [L] setNumber
 *  @param number {number}
 */
Link.prototype.setNumber = function (number) {
    if ($.isNumeric(number)) {
        number = parseInt(number);
        if (number > 1) {
            this.jtopo.text = '(+' + number + ')';
        } else {
            number = 1;
            this.jtopo.text = '';
        }
        this.attr.number = number;
    }
};
/**
 *  设置链路宽度,小于0则默认为1
 *  @method [L] setWidth
 *  @param width {number}
 */
Link.prototype.setWidth = function (width) {
    if ($.isNumeric(width)) {
        var newWidth = parseInt(width);
        this.jtopo.lineWidth = newWidth > 0 ? newWidth : 1; // 线宽
    }
    this.attr.width = this.jtopo.lineWidth;
};
/**
 *  设置链路两端的箭头属性
 *  @method [L] setArrow
 *  @param arrow {object}
 *
 *          arrow={
 *              size:箭头大小{number},
 *              offset:箭头在链路上的偏移量{number},
 *              start:是否显示起点箭头{boolean},
 *              end:是否显示终点箭头{boolean},
 *          }
 */
Link.prototype.setArrow = function (arrow) {
    if (arrow) {
        if(typeof arrow.size!='undefined'){
            this.jtopo.arrowsRadius = $.isNumeric(arrow.size) ? parseInt(arrow.size) : 0;
        }
        if(typeof arrow.offset!='undefined'){
            this.jtopo.arrowsOffset = $.isNumeric(arrow.offset) ? parseInt(arrow.offset) : 0;
        }
        if (!this.attr.arrow) {
            this.attr.arrow = {};
        }

        if (typeof arrow.start!='undefined') {
            this.attr.arrow.start = typeof arrow.start == "boolean" ? arrow.start : arrow.start == "true";
        }
        if (typeof arrow.end!='undefined') {
            this.attr.arrow.end = typeof arrow.end == "boolean" ? arrow.end : arrow.end == "true";
        }
    }
    this.attr.arrow.size = this.jtopo.arrowsRadius;
    this.attr.arrow.offset = this.jtopo.arrowsOffset;
};
/**
 *  设置相同起点和终点的链路之间的间隔大小
 *
 *  常用于设置QTopo.constant.link.DIRECT类型的链路展开时,其子链路之间的间距大小
 *  @method [L] setGap
 *  @param gap {number}
 */
Link.prototype.setGap = function (gap) {
    if (gap) {
        this.jtopo.bundleGap = $.isNumeric(gap) ? parseInt(gap) : 0; // 线条之间的间隔
    }
    this.attr.gap = this.jtopo.bundleGap;
};
/**
 *  设置链路的虚线线段长度
 *
 *  设置不为number类型或小于0时，则认为不要虚线
 *
 *  @method [L] setDashed
 *  @param dashedPattern {number|null}
 */
Link.prototype.setDashed = function (dashedPattern) {
    if ($.isNumeric(dashedPattern) && dashedPattern > 0) {
        this.jtopo.dashedPattern = parseInt(dashedPattern);
    } else {
        this.jtopo.dashedPattern = null;
    }
    this.attr.dashed = this.jtopo.dashedPattern;
};
/**
 *  单个对象的属性提取
 *  @method [L] toJson
 *  @return {object}
 */
Link.prototype.toJson=function(){
    var json=$.extend({},this.attr);
    json.extra=$.extend({},this.extra);
    json.start=this.path.start.get('jsonId');
    json.end=this.path.end.get('jsonId');
    return json;
};
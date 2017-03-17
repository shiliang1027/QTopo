/**
 * Created by qiyc on 2017/2/7.
 */
var Element = require("../Element.js");
module.exports = Link;
var jtopoReset = {
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
    //记录两端的节点
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
Link.prototype.getType = function () {
    return QTopo.constant.LINK;
};
Link.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color = this.jtopo.strokeColor;
};
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
Link.prototype.setWidth = function (width) {
    if ($.isNumeric(width)) {
        var newWidth = parseInt(width);
        this.jtopo.lineWidth = newWidth > 0 ? newWidth : 1; // 线宽
    }
    this.attr.width = this.jtopo.lineWidth;
};
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
Link.prototype.setGap = function (gap) {
    if (gap) {
        this.jtopo.bundleGap = $.isNumeric(gap) ? parseInt(gap) : 0; // 线条之间的间隔
    }
    this.attr.gap = this.jtopo.bundleGap;
};
Link.prototype.setDashed = function (dashedPattern) {
    if ($.isNumeric(dashedPattern) && dashedPattern > 0) {
        this.jtopo.dashedPattern = parseInt(dashedPattern);
    } else {
        this.jtopo.dashedPattern = null;
    }
    this.attr.dashed = this.jtopo.dashedPattern;
};
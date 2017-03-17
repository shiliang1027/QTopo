/**
 * Created by qiyc on 2017/2/7.
 */
var Link = require("./Link.js");
module.exports = {
    constructor: CurveLink,
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
    gap: 20,
    width: 2,
    dashed: null,
    zIndex: 100,
    font: {
        size: 16,
        type: "微软雅黑",
        color: '255,255,255'
    },
    useType: QTopo.constant.link.CURVE,
    curveOffset: 200
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//------
var jtopoRest={
    //改写源码绘制二次贝赛尔曲线
    //修改始终点的位置，用以确定箭头方向
    getStart: function () {
        var a;
        var b = this.nodeA, c = this.nodeZ;
        var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
        var e = b.getBound();
        a = JTopo.util.intersectionLineBound(d, e);
        return a;
    },
    getEnd:function () {
        var a;
        var b = this.nodeZ, c = this.nodeA;
        var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
        var e = b.getBound();
        a = JTopo.util.intersectionLineBound(d, e);
        return a;
    },
    //获取曲线的路径点，返回应是数组
    getPath:function () {
        var path = [], start = this.getStartPosition(), end = this.getEndPosition();
        if (this.nodeA === this.nodeZ)return [start, end];
        if (start && end) {
            var angle = Math.atan(Math.abs(end.y - start.y) / Math.abs(end.x - start.x));
            var mX = (start.x + end.x) / 2 + this.qtopo.attr.curveOffset * Math.cos(angle - Math.PI / 2);
            var mY = (start.y + end.y) / 2 + this.qtopo.attr.curveOffset * Math.sin(angle - Math.PI / 2);
            path.start = start;
            path.end = end;
            path.middle = {
                x: mX,
                y: mY
            };
            path.text =  makePoint(path.start,path.middle, path.end, 1/2);
            path.angle = angle;
            path.push(start);
            path.push(end);
        }
        return path
    },
    //绘制曲线路径
    paintPath:function (cx, path) {
        if (this.nodeA === this.nodeZ)return void this.paintLoop(cx);
        var start = path.start;
        var end = path.end;
        var middle = path.middle;
        if (start && end && middle) {
            cx.beginPath();
            cx.moveTo(start.x, start.y);
            cx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
            cx.lineWidth = this.lineWidth;
            cx.moveTo(start.x, start.y);
            cx.quadraticCurveTo(middle.x, middle.y, end.x, end.y);
            cx.stroke();
            if (cx.stroke(), cx.closePath(), null != this.arrowsRadius) {
                if (this.qtopo.attr.arrow.end) {
                    this.paintArrow(cx, start, end);
                }
                if (this.qtopo.attr.arrow.start) {
                    this.paintArrow(cx, end, start);
                }
            }
        }
    },
    //线上文本位置
    paintText:function (cx, path) {
        if (path && path.text && this.text && this.text.length > 0) {
            var textX = path.text.x + this.textOffsetX;
            var textY = path.text.y + this.textOffsetY;
            cx.save();
            cx.beginPath();
            cx.font = this.font;
            var totalWidth = cx.measureText(this.text).width;
            var fontWidth = cx.measureText("田").width;
            cx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            cx.fillText(this.text, textX - totalWidth / 2, textY - fontWidth / 2);
            cx.stroke();
            cx.closePath();
            cx.restore();
        }
    },
    //判断点是否落在曲线上,原理基于二次贝塞尔曲线公式阶段点取样,判断点是否落在每小部分的线段上
    isInBound:function (x, y) {
        if (this.nodeA === this.nodeZ) {
            var d = this.bundleGap * (this.nodeIndex + 1) / 2, e = a.util.getDistance(this.nodeA, {x: x, y: y}) - d;
            return Math.abs(e) <= 3
        }
        //----
        var flag = false;
        var start = this.path.start;
        var end = this.path.end;
        var middle = this.path.middle;
        var angle = this.path.angle;//起始点之间的夹角
        if(start&&end&&middle&&angle){
            var temp1 = start;//首次为起点
            var temp2;
            for (var i = 1; i <= 10; i++) {
                temp2 = makePoint(start, middle, end, i / 10);//取样为10份
                //判断点是否落在temp1和temp2构成的直线上
                if (pointInLine({x: x, y: y}, temp1, temp2, this.width / 2, angle)) {
                    flag = true;
                    break
                }
                temp1 = temp2;
            }
        }
        return flag
    }
};
//----
//制造一个二次贝塞尔曲线的阶段点
function makePoint(s, m, e, t) {
    return {
        x: (1 - t) * (1 - t) * s.x + 2 * t * (1 - t) * m.x + t * t * e.x,
        y: (1 - t) * (1 - t) * s.y + 2 * t * (1 - t) * m.y + t * t * e.y
    }
}
//考虑到线段的粗细,需要判断点是否在矩形内，若点同时在顺时针4个点成的4条线的右侧,则为在矩形内
function pointInLine(p, s, e, w, an) {
    var rectangle = [//顺时针，从左上开始
        {
            x: s.x - w * Math.sin(an),
            y: s.y - w * Math.cos(an)
        },
        {
            x: e.x - w * Math.sin(an),
            y: e.y - w * Math.cos(an)
        },
        {
            x: e.x + w * Math.sin(an),
            y: e.y + w * Math.cos(an)
        },
        {
            x: s.x + w * Math.sin(an),
            y: s.y + w * Math.cos(an)
        }
    ];
    return poinRightLine(rectangle[0], rectangle[1], p) && poinRightLine(rectangle[1], rectangle[2], p) && poinRightLine(rectangle[2], rectangle[3], p) && poinRightLine(rectangle[3], rectangle[0], p);
}
//判断点在线的右侧?
function poinRightLine(s, e, p) {
    return ((e.x - s.x) * (-p.y + s.y) - (-e.y + s.y) * (p.x - s.x)) < 0;
}
//---
//------
//-
function CurveLink(config) {
    if (!config.start || !config.end || !config.start.jtopo || !config.end.jtopo) {
        QTopo.util.error("Create Link need start and end");
        return;
    }
    Link.call(this, new JTopo.CurveLink(config.start.jtopo, config.end.jtopo));
    this.attr = QTopo.util.extend(getDefault(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //改写源码绘制曲线,可由curveOffset指定弧度
    reset(this);
}
QTopo.util.inherits(CurveLink, Link);
//-
function setJTopo(config) {
    if (config) {
        var self = this;
        self._setAttr(config);
    }
}
function reset(link) {
    link.jtopo.getStartPosition =jtopoRest.getStart;
    link.jtopo.getEndPosition =jtopoRest.getEnd;
    link.jtopo.paintPath =jtopoRest.paintPath;
    link.jtopo.getPath =jtopoRest.getPath;
    link.jtopo.isInBound = jtopoRest.isInBound;
    link.jtopo.paintText =jtopoRest.paintText;
}
//-
CurveLink.prototype.setCurveOffset = function (data) {
    if ($.isNumeric(data)) {
        this.attr.curveOffset = parseInt(data);
    }
};
CurveLink.prototype.getDefault = getDefault;
//-
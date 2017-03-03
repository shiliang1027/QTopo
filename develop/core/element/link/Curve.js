/**
 * Created by qiyc on 2017/2/7.
 */
var Link=require("./Link.js");
module.exports = {
    constructor:CurveLink,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT ={
        number: 1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:false
        },
        gap:20,
        width: 2,
        dashed:  null,
        zIndex : 100,
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        useType: QTopo.constant.link.CURVE,
        curveOffset:200
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//-
function CurveLink(config){
    if(!config.start||!config.end||!config.start.jtopo||!config.end.jtopo){
        QTopo.util.error("Create Link need start and end");
        return;
    }
    Link.call(this,new JTopo.CurveLink(config.start.jtopo, config.end.jtopo));
    this.attr =  QTopo.util.extend(getDefault(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //改写源码绘制曲线,可由curveOffset指定弧度
    reset(this);
}
QTopo.util.inherits(CurveLink,Link);
//-
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setAttr(config);
    }
}
function reset(link){
    link.jtopo.getStartPosition = function () {
        var a;
        return (a = (function (thisl) {
            var b = thisl.nodeA, c = thisl.nodeZ;
            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
            var e = b.getBound();
            return f = JTopo.util.intersectionLineBound(d, e);
        })(this)), a;
    };
    link.jtopo.getEndPosition = function () {
        var a;
        return (a = (function (thisl) {
            var b = thisl.nodeZ, c = thisl.nodeA;
            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
            var e = b.getBound();
            return f = JTopo.util.intersectionLineBound(d, e);
        })(this)), a;
    };
    link.jtopo.paintPath = function (cx, path) {
        if (this.nodeA === this.nodeZ)return void this.paintLoop(cx);
        var s = path[0];
        var t = path[path.length - 1];
        cx.beginPath();
        cx.moveTo(s.x, s.y);
        var angle = Math.atan(Math.abs(t.y - s.y) / Math.abs(t.x - s.x));
        var mX = (s.x + t.x) / 2 + link.attr.curveOffset * Math.cos(angle - Math.PI / 2);
        var mY = (s.y + t.y) / 2 + link.attr.curveOffset * Math.sin(angle - Math.PI / 2);
        cx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
        cx.lineWidth = this.lineWidth;
        cx.moveTo(s.x, s.cy);
        cx.quadraticCurveTo(mX, mY, t.x, t.y);
        cx.stroke();
        if (cx.stroke(), cx.closePath(), null != this.arrowsRadius) {
            if (link.attr.arrow.end) {
                this.paintArrow(cx, s, t);
            }
            if (link.attr.arrow.start) {
                this.paintArrow(cx, t, s);
            }
        }
    };
}
//-
CurveLink.prototype.setCurveOffset=function(data){
    if($.isNumeric(data)){
        this.attr.curveOffset=parseInt(data);
    }
};
CurveLink.prototype.getDefault=getDefault;
//-
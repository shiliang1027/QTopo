/**
 * Created by qiyc on 2017/2/7.
 */
var Link=require("./Link.js");
module.exports = DirectLink;
//直线
var defaults =function(){
    return {
        num: 1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
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
        useType: QTopo.constant.link.DIRECT,
        bundleOffset:60// 多条直线时，线条折线拐角处的长度
    };
};
function DirectLink(config) {
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    Link.call(this,new JTopo.Link(config.start.jtopo, config.end.jtopo));
    this.attr =  QTopo.util.extend(defaults(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //源码修改
    reset(this);
}
QTopo.util.inherits(DirectLink,Link);
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setAttr(config);
    }
}
function reset(link){
    //双向箭头
    link.jtopo.getStartPosition = function () {
        var a;
        return null != this.arrowsRadius && (a = (function (thisl) {
            var b = thisl.nodeA, c = thisl.nodeZ;
            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
            var e = b.getBound();
            return f = JTopo.util.intersectionLineBound(d, e);
        })(this)), null == a && (a = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
        }), a;
    };
    link.jtopo.paintPath = function (a, b) {
        if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
        a.beginPath(),
            a.moveTo(b[0].x, b[0].y);
        for (var c = 1; c < b.length; c++) {
            null == this.dashedPattern ? (
                (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
            ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
        }
        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
            if (link.attr.arrow.end) {
                this.paintArrow(a, b[0], b[b.length - 1]);
            }//终点箭头
            if (link.attr.arrow.start) {
                this.paintArrow(a, b[b.length - 1], b[0]);
            }//起点箭头
        }
    };
}
DirectLink.prototype.setBundleOffset=function(bundleOffset){
    if($.isNumeric(bundleOffset)){
        this.jtopo.bundleOffset=parseInt(bundleOffset);
    }
    this.attr.bundleOffset=this.jtopo.bundleOffset;
};